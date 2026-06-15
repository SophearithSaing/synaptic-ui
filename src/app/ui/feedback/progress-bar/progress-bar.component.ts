import { Component, Input } from '@angular/core';

@Component({
  selector: 'syn-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class SynProgressBarComponent {
  @Input() public label: string | null = null;

  @Input() public value = 0;

  /**
   * Returns a safe progress value within the rendered range.
   *
   * @returns Progress value clamped from 0 to 100.
   */
  public normalizedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }

  /**
   * Returns the accessible progress label.
   *
   * @returns Explicit label or generated percentage label.
   */
  public progressLabel(): string {
    return this.label ?? `${this.normalizedValue()} percent complete`;
  }
}
