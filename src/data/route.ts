import { Page } from './page.ts';

export interface Route<RouteOptions = any, RouteState = any> {
  rule: string | RegExp;
  handler?(page: Page<RouteOptions, RouteState>): Promise<void>;
  options?: RouteOptions;
}