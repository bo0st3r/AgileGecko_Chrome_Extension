import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Manage tabs in Chrome.
 */
export class TabManagerService {

  constructor() {
  }

  /**
   * Open a new tab in the browser.
   */
  public openTab(url: string): void {
    chrome.tabs.create({url}, () => {
    });
  }
}
