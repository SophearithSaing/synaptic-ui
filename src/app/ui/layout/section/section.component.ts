import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'syn-section',
  standalone: true,
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SynSectionComponent {
  @Input() public sectionId: string | null = null;

  @Input({ transform: booleanAttribute }) public raised = false;
}
