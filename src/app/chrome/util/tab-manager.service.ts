import { Injectable } from '@angular/core';
import id = chrome.runtime.id;
import {logger} from 'codelyzer/util/logger';

@Injectable({
  providedIn: 'root'
})
/**
 * Manages tabs in Chrome.
 */
export class TabManagerService {

  constructor() { }

  /**
   * Opens a new tab in the explorer, adds a suffix if given.
   */
  public openTab(url: string): void {
    chrome.tabs.create({url}, () => {});
  }
}
