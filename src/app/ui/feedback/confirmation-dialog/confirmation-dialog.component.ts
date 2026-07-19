import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SynButtonComponent } from '../../actions';

@Component({
  selector: 'syn-confirmation-dialog',
  imports: [SynButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './confirmation-dialog.component.scss',
})
export class SynConfirmationDialogComponent {
  @Input() public cancelLabel = 'Cancel';

  @Input() public confirmLabel = 'Confirm';

  @Input() public description = '';

  @Input() public descriptionId = 'confirmation-dialog-description';

  @Input() public error: string | null = null;

  @Input({ transform: booleanAttribute }) public loading = false;

  @Input() public loadingConfirmLabel = 'Confirming';

  @Input({ required: true }) public title = '';

  @Input() public titleId = 'confirmation-dialog-title';

  @Output() public readonly cancel = new EventEmitter<void>();

  @Output() public readonly confirm = new EventEmitter<void>();

  /**
   * Emits when the cancel action is selected.
   */
  public onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Emits when the confirm action is selected.
   */
  public onConfirm(): void {
    this.confirm.emit();
  }
}
