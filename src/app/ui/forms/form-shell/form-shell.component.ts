import { booleanAttribute, Component, Input, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'syn-form-shell',
  standalone: true,
  imports: [NgClass],
  templateUrl: './form-shell.component.html',
  styleUrl: './form-shell.component.scss',
})
export class SynFormShellComponent implements OnChanges {
  @Input({ transform: booleanAttribute }) public center = false;

  public shellClasses: Record<string, boolean> = this.createShellClasses();

  /**
   * Updates shell classes when inputs change.
   */
  public ngOnChanges(): void {
    this.shellClasses = this.createShellClasses();
  }

  /**
   * Builds state classes for the rendered form shell.
   *
   * @returns Form shell class map keyed by CSS class name.
   */
  private createShellClasses(): Record<string, boolean> {
    return {
      'form-shell--center': this.center,
    };
  }
}
