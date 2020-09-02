import { Injectable } from '@angular/core';
import id = chrome.runtime.id;

@Injectable({
  providedIn: 'root'
})
export class TabManagerService {

  constructor() { }

  /**
   * Opens a new tab in the explorer, adds a suffix if given.
   * @param coinId ID of the coin to consult
   */
  public openTab(url: string, suffix?: string): void {
    chrome.tabs.create({url: url + suffix}, () => {});
  }
}
