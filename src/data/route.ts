import { Page } from './page.ts';

export interface Route<RouteOptions = any> {
  rule: string | RegExp;
  handler?(page: Page): Promise<void>;
  options?: RouteOptions;
}