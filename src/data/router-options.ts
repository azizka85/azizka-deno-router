import { Page } from './page.ts';
import { Route } from './route.ts';

export interface RouterOptions<RouteOptions = any> {
  root?: string,
  routes?: Route<RouteOptions>[],
  before?(page: Page): boolean;
  page404?(fragment: string): void;
}