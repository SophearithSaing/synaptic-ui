import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'syn-info-card',
  standalone: true,
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class SynInfoCardComponent {
  @Input() public description = '';

  @Input() public icon: string | null = null;

  @Input({ transform: booleanAttribute }) public interactive = false;

  @Input({ required: true }) public title = '';
}
