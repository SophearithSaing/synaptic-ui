import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SynButtonComponent } from '../../actions';

@Component({
  selector: 'syn-json-viewer-dialog',
  imports: [SynButtonComponent],
  templateUrl: './json-viewer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './json-viewer-dialog.component.scss',
})
export class SynJsonViewerDialogComponent {
  @Input({ required: true }) public content = '';

  @Input({ required: true }) public title = '';

  @Input() public titleId = 'json-viewer-dialog-title';

  @Output() public readonly close = new EventEmitter<void>();

  /**
   * Emits when the viewer close action is selected.
   */
  public onClose(): void {
    this.close.emit();
  }
}
