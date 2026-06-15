import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'syn-catalog-card',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './catalog-card.component.html',
  styleUrl: './catalog-card.component.scss',
})
export class SynCatalogCardComponent {
  @Input() public description = '';

  @Input() public href: string | null = null;

  @Input() public icon: string | null = null;

  @Input() public label = '';

  @Input() public routerLink: string | null = null;

  @Input() public tags: readonly string[] = [];

  @Input({ required: true }) public title = '';
}
