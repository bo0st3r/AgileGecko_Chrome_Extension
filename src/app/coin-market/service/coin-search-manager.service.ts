import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Manage the updates for the coin search.
 */
export class CoinSearchManagerService implements OnDestroy {
  private searchSubject = new BehaviorSubject<string>(null);

  ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
  }

  public nextSearch(search: string): void {
    this.searchSubject.next(search);
  }

  public searchAsObservable(): Observable<string> {
    return this.searchSubject.asObservable();
  }

  public getSearch(): string {
    return this.searchSubject.getValue();
  }
}
