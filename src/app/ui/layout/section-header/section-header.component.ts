import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'syn-section-header',
  standalone: true,
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SynSectionHeaderComponent {
  @Input() public description: string | null = null;

  @Input() public headingId: string | null = null;

  @Input({ transform: booleanAttribute }) public inline = false;

  @Input({ required: true }) public title = '';
}
