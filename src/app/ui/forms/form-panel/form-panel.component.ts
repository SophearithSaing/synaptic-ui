import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'syn-form-panel',
  standalone: true,
  templateUrl: './form-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './form-panel.component.scss',
})
export class SynFormPanelComponent {
  @Input() public description = '';

  @Input() public error: string | null = null;

  @Input({ required: true }) public title = '';

  @Input() public titleId: string | null = null;

  @Output() public readonly formSubmit = new EventEmitter<SubmitEvent>();

  /**
   * Emits the native form submit event to the parent page.
   *
   * @param event Native form submit event.
   */
  public onSubmit(event: SubmitEvent): void {
    this.formSubmit.emit(event);
  }
}
