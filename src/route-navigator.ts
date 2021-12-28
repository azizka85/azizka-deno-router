import { Router } from './router.ts';

import { transformURL, trimSlashes, parseQuery } from './utils.ts';

export class RouteNavigator<RouteOptions = any> {
  protected popStateHandler: () => void;

  constructor(
    protected router: Router<RouteOptions>
  ) { 
    this.popStateHandler = () => {
      router.processUrl(this.fragment, this.query);
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

  async redirectTo(url: string, state?: any) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  

    history.replaceState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery);
  }

  async navigateTo(url: string, state?: any) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  
    
    history.pushState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery);
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