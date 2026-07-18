import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'syn-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './empty-state.component.scss',
})
export class SynEmptyStateComponent {
  @Input() public description = '';

  @Input() public icon: string | null = null;

  @Input({ required: true }) public title = '';
}
