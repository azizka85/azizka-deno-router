import { Page } from './data/page.ts';
import { Route } from './data/route.ts';
import { RouterOptions } from './data/router-options.ts';

import { trimSlashes, parseRouteRule } from './utils.ts';

export class Router<RouteOptions = any> {
  protected routes: Route<RouteOptions>[] = [];
  protected root = '/';
  protected before?(page: Page): boolean;
  protected page404?(fragment: string): void;

  constructor(options?: RouterOptions<RouteOptions>) {
    this.before = options?.before;
    this.page404 = options?.page404;

    if(options?.root) {
      this.root = options.root === '/' ? '/' : `/${trimSlashes(options.root)}/`;
    }

    if(options?.routes) {
      this.addRoutes(options.routes);
    }
  }

  get rootPath() {
    return this.root;
  }

  addRoutes(routes: Route<RouteOptions>[]) {
    for(const route of routes) {
      this.add(route.rule, route.handler, route.options);
    }
  }

  add(rule: string | RegExp, handler?: (page: Page) => Promise<void>, options?: RouteOptions) {
    this.routes.push({
      rule: parseRouteRule(rule),
      handler,
      options
    });

    return this;
  }

  remove(param: string | RegExp | ((page: Page) => Promise<void>)) {
    this.routes.some((route, i) => {
      if(route.handler === param || route.rule === parseRouteRule(param as string | RegExp)) {
        this.routes.splice(i, 1);

        return true;
      }

      return false;
    });
    
    return this;
  } 
  
  findRoute(currentPath: string) {    
    for(const route of this.routes) {
      const match = currentPath.match(route.rule);

      if(match) {
        return {
          match,
          route
        };
      }
    }
  }

  async processUrl(currentPath: string, currentQuery: { [key: string]: string }) {
    const doBreak = this.before?.({
      fragment: currentPath,
      query: currentQuery
    });

    if(!doBreak) {
      const found = this.findRoute(currentPath);

      if(!found) {
        this.page404?.(currentPath);
      } else {
        found.match.shift();

        const page: Page<RouteOptions> = {
          fragment: currentPath,
          query: currentQuery,
          match: found.match,
          options: found.route.options
        };

        await found.route.handler?.(page);
      }
    }
  }
}