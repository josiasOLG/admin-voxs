import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { AppointmentTableListComponent } from '../../components';
import { IAppointment } from '../../schema';
import { AppointmentService } from '../../services';

@Component({
  selector: 'app-appointment-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SharedHeaderComponent,
    AppointmentTableListComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent
  extends BaseResourceComponent
  implements OnInit
{
  private appointmentService = inject(AppointmentService);

  public displayedColumns = this.generateDisplayedColumns<IAppointment>(
    {
      _id: '',
      userId: '',
      barberId: '',
      date: new Date(),
      time: '',
      status: 'pending' as const,
      service: [],
      notes: '',
      statusPoint: false,
      repete: '',
      allDay: false,
      color: '',
      userNumber: '',
      modality: '',
      active: true,
    },
    {
      exclude: [
        '_id',
        'idServico',
        'statusAprovacao',
        'statusMensage',
        'exceptions',
        'endRepeat',
        'create',
        'update',
      ],
      includeActions: true,
    }
  );
  public dataSource: IAppointment[] = [];
  public isDataLoading = true;

  ngOnInit(): void {
    this.setBreadcrumb([
      { label: 'Agendamentos' },
      { label: 'Listar Agendamentos' },
    ]);
    this.appointmentService.getAll().subscribe({
      next: (response: any) => {
        this.dataSource = response;

        this.isDataLoading = false;
        console.log('response >', this.dataSource);
      },
      error: (error: any) => {
        console.error('Error fetching appointments:', error);
        this.isDataLoading = false;
      },
    });
  }

  public applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // TODO: Implementar filtro com PrimeNG
  }

  public onDeleteItem(id: string): void {
    this.dataSource = this.dataSource.filter((item) => item._id !== id);
  }

  public goToCreate(): void {
    this.goTo('/appointment/create');
  }
}
