import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { extractData } from '../../../../core';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { DashboardTableListComponent } from '../../components/dashboard-table-list/dashboard-table-list.component';
import { IVeiculo } from '../../schema';
import { DashboardService } from '../../services';

@Component({
  selector: 'app-dashboard-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SharedHeaderComponent,
    DashboardTableListComponent,
  ],
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
})
export class DashboardListPage extends BaseResourceComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  public displayedColumns = this.generateDisplayedColumns<IVeiculo>(
    {
      id: 0,
      placa: '',
      modelo: '',
      chassi: '',
      renavam: '',
      ano: '',
    },
    {
      exclude: ['id'],
      includeActions: true,
    }
  );
  public dataSource: IVeiculo[] = [];
  public filteredData: IVeiculo[] = [];
  public searchValue = '';

  ngOnInit(): void {
    this.setBreadcrumb([{ label: 'Dashboard' }, { label: 'Listar Veículos' }]);
    this.dashboardService.getAll().subscribe({
      next: (response: any) => {
        this.dataSource = extractData(response);
        this.filteredData = [...this.dataSource];
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error fetching vehicles:', error);
      },
    });
  }

  public applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValue = value;

    if (!value) {
      this.filteredData = [...this.dataSource];
      return;
    }

    this.filteredData = this.dataSource.filter(
      (veiculo) =>
        veiculo.placa?.toLowerCase().includes(value) ||
        veiculo.modelo?.toLowerCase().includes(value) ||
        veiculo.chassi?.toLowerCase().includes(value) ||
        veiculo.renavam?.toLowerCase().includes(value) ||
        veiculo.ano?.toLowerCase().includes(value)
    );
  }

  public excluir(id: string): void {
    this.dataSource = this.dataSource.filter((v) => v.id !== parseInt(id));
    this.filteredData = this.filteredData.filter((v) => v.id !== parseInt(id));
  }

  public goToCreate(): void {
    this.goTo('/dashboard/create');
  }
}
