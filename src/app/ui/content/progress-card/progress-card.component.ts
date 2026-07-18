import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'syn-progress-card',
  imports: [RouterLink],
  templateUrl: './progress-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './progress-card.component.scss',
})
export class SynProgressCardComponent {
  @Input() public actionLabel = 'Continue';

  @Input() public icon: string | null = null;

  @Input() public level: number | null = null;

  @Input() public progress = 0;

  @Input() public routerLink: string | null = null;

  @Input({ required: true }) public title = '';

  @Output() public readonly action = new EventEmitter<void>();

  /**
   * Returns a safe progress value within the rendered range.
   *
   * @returns Progress value clamped from 0 to 100.
   */
  public normalizedProgress(): number {
    return Math.max(0, Math.min(100, this.progress));
  }

  /**
   * Emits when the progress card action is selected.
   */
  public onAction(): void {
    this.action.emit();
  }
}
