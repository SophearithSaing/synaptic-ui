import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'syn-container',
  standalone: true,
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class SynContainerComponent {
  @Input({ transform: booleanAttribute }) public narrow = false;
}
