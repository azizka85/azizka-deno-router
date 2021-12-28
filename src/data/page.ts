export interface Page<RouteOptions = any> {
  fragment: string;
  query: {[key: string]: any};
  match?: RegExpMatchArray;
  options?: RouteOptions;
}