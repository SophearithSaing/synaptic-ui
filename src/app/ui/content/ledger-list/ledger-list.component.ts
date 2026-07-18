import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { SynLedgerItem } from '../models/ledger-item.model';

@Component({
  selector: 'syn-ledger-list',
  standalone: true,
  templateUrl: './ledger-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ledger-list.component.scss',
})
export class SynLedgerListComponent {
  @Input() public items: readonly SynLedgerItem[] = [];
}
