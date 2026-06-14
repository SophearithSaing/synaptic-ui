import { Component, Input } from '@angular/core';

import { SynLedgerItem } from '../models/ledger-item.model';

@Component({
  selector: 'syn-ledger-list',
  standalone: true,
  templateUrl: './ledger-list.component.html',
  styleUrl: './ledger-list.component.scss',
})
export class SynLedgerListComponent {
  @Input() public items: readonly SynLedgerItem[] = [];
}
