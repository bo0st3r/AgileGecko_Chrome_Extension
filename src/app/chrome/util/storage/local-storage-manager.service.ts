import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Handles local storage operations using JSON.
 */
export class LocalStorageManagerService {

  constructor() { }

  /**
   * Saves any object in local storage for the given key.
   * @param key location in local storage
   * @param obj value for the key
   */
  save(key: string, obj: object): void{
    const json = JSON.stringify(obj);
    localStorage.setItem(key, json);
  }

  /**
   * Finds value from local storage at given key.
   * If nothing, returns {@link undefined}.
   * @param key location in local storage
   */
  find(key: string): any{
    const json = localStorage.getItem(key);
    const item = JSON.parse(json);
    return item ? item : undefined;
  }

  /**
   * Deletes value at given key in local storage.
   * @param key location in local storage
   */
  delete(key: string): void{
    localStorage.removeItem(key);
  }
}
