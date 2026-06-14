import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'syn-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class SynCardComponent {
  @Input({ transform: booleanAttribute }) public flush = false;

  @Input({ transform: booleanAttribute }) public interactive = false;

  @Input({ transform: booleanAttribute }) public ledger = false;
}
