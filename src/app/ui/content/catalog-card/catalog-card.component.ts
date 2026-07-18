import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'syn-catalog-card',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './catalog-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
