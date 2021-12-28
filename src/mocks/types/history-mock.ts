export class HistoryMock {
  url?: string;
  state: any;

  replaceState(state: any, unused: string, url: string) {
    this.state = state;
    this.url = url;
  }

  pushState(state: any, unused: string, url: string) {
    this.state = state;
    this.url = url;
  }
}