export interface SynNavItem {
  readonly active?: boolean;
  readonly href?: string;
  readonly label: string;
  readonly routerLink?: string;
}

export interface SynNavAction extends SynNavItem {
  readonly variant?: 'primary' | 'secondary' | 'ghost';
}
