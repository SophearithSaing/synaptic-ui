import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'syn-brand',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class SynBrandComponent {
  @Input() public ariaLabel = 'Synaptic home';

  @Input() public href: string | null = null;

  @Input() public label = 'Synaptic';

  @Input() public logoSrc = 'assets/logo.png';

  @Input() public routerLink: string | null = null;
}
