import { Page } from './data/page.ts';
import { Route } from './data/route.ts';
import { RouterOptions } from './data/router-options.ts';

import { trimSlashes, parseRouteRule } from './utils.ts';

export class Router<RouteOptions = any, RouteState = any> {
  protected routes: Route<RouteOptions, RouteState>[] = [];
  protected root = '/';
  protected before?(page: Page<RouteOptions, RouteState>): boolean;
  protected page404?(page: Page<RouteOptions, RouteState>): void;

  constructor(options?: RouterOptions<RouteOptions, RouteState>) {
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

  addRoutes(routes: Route<RouteOptions, RouteState>[]) {
    for(const route of routes) {
      this.add(route.rule, route.handler, route.options);
    }
  }

  add(rule: string | RegExp, handler?: (page: Page<RouteOptions, RouteState>) => Promise<void>, options?: RouteOptions) {
    this.routes.push({
      rule: parseRouteRule(rule),
      handler,
      options
    });

    return this;
  }

  remove(param: string | RegExp | ((page: Page<RouteOptions, RouteState>) => Promise<void>)) {
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

  async processUrl(currentPath: string, currentQuery: { [key: string]: string }, state?: RouteState) {
    const doBreak = this.before?.({
      fragment: currentPath,
      query: currentQuery,
      state
    });

    if(!doBreak) {
      const found = this.findRoute(currentPath);

      if(!found) {
        this.page404?.({
          fragment: currentPath,
          query: currentQuery,
          state
        });
      } else {
        found.match.shift();

        const page: Page<RouteOptions, RouteState> = {
          fragment: currentPath,
          query: currentQuery,
          match: found.match,
          options: found.route.options,
          state
        };

        await found.route.handler?.(page);
      }
    }
  }
}