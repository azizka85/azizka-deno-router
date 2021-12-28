import { Router } from './router.ts';

import { transformURL, trimSlashes, parseQuery } from './utils.ts';

export class RouteNavigator<RouteOptions = any, RouteState = any> {
  protected popStateHandler: () => void;

  constructor(
    protected router: Router<RouteOptions, RouteState>
  ) { 
    this.popStateHandler = () => {
      router.processUrl(this.fragment, this.query, history.state);
    };
  }  

  get fragment() {
    let value = decodeURI(location.pathname);
  
    if(this.router.rootPath !== '/') {
      value = value.replace(this.router.rootPath, '');
    }
  
    return trimSlashes(value);
  }
  
  get query() {
    return parseQuery(location.search);
  }

  async redirectTo(url: string, state?: RouteState) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  

    history.replaceState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery, state);
  }

  async navigateTo(url: string, state?: RouteState) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  
    
    history.pushState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery, state);
  }

  refresh() {
    return this.redirectTo(this.fragment + location.search, history.state);
  } 

  addUriListener() {
    window.addEventListener('popstate', this.popStateHandler);
  }

  removeUriListener() {
    window.removeEventListener('popstate', this.popStateHandler);
  }
}