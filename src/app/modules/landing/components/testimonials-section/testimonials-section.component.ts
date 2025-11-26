import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  Testimonial,
  TestimonialsCarouselComponent,
} from '../testimonials-carousel/testimonials-carousel.component';

/**
 * Componente da seção de depoimentos/avaliações
 * Exibe avaliações de clientes com carousel
 */
@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, TestimonialsCarouselComponent],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
})
export class TestimonialsSectionComponent {
  public testimonials = input.required<Testimonial[]>();
}
