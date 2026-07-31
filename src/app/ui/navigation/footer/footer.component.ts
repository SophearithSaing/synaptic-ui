import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'syn-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss',
})
export class SynFooterComponent {
  @Input() public copy: string | null = '© 2026 Synaptic. Not a real company.';
}
