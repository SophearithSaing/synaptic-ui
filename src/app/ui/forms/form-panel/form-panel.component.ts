import { Component, Input } from '@angular/core';

@Component({
  selector: 'syn-form-panel',
  standalone: true,
  templateUrl: './form-panel.component.html',
  styleUrl: './form-panel.component.scss',
})
export class SynFormPanelComponent {
  @Input() public description = '';

  @Input({ required: true }) public title = '';

  @Input() public titleId: string | null = null;
}
