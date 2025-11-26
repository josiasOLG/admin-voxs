import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

/**
 * Interface para depoimento/testimonial
 */
export interface Testimonial {
  text: string;
  author: string;
  role: string;
  rating: number;
}

/**
 * Componente de carousel de depoimentos
 * Exibe depoimentos de clientes com navegação automática
 */
@Component({
  selector: 'app-testimonials-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './testimonials-carousel.component.html',
  styleUrls: ['./testimonials-carousel.component.scss'],
})
export class TestimonialsCarouselComponent {
  public testimonials = input.required<Testimonial[]>();

  public readonly responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  public readonly stars = [1, 2, 3, 4, 5];
}
