import { HistoryMock } from './types/history-mock.ts';

declare global {
  interface History extends HistoryMock { }

  var history: History;
  interface Window {
    readonly history: History
  }
}

window.history = new HistoryMock() as History;