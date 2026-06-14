import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'syn-progress-card',
  standalone: true,
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss',
})
export class SynProgressCardComponent {
  @Input() public actionLabel = 'Continue';

  @Input() public icon: string | null = null;

  @Input() public level: number | null = null;

  @Input() public progress = 0;

  @Input({ required: true }) public title = '';

  @Output() public readonly action = new EventEmitter<void>();

  /**
   * Emits when the progress card action is selected.
   */
  public onAction(): void {
    this.action.emit();
  }
}
