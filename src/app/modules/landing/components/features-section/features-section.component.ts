import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * Interface para feature/recurso
 */
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

/**
 * Componente da seção de recursos/features
 * Exibe grid de cards com recursos da plataforma
 */
@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
})
export class FeaturesSectionComponent {
  public features = input.required<Feature[]>();
}
