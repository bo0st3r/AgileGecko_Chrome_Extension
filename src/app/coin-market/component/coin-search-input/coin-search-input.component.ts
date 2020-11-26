import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {constants} from '../../../../constants/constants';
import {CoinGeckoRepositoryService} from '../../service/repository/coin-gecko-repository.service';
import {CoinSearchManagerService} from '../../service/coin-search-manager.service';
import {CoinListManagerService} from '../../service/coin-list-manager.service';

@Component({
  selector: 'app-coin-search-input',
  templateUrl: './coin-search-input.component.html',
  styleUrls: ['./coin-search-input.component.css']
})
export class CoinSearchInputComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Observable for the search input element: {@link searchInput}.
   */
  public inputObs: Observable<Event>;

  /**
   * Search input element.
   */
  @ViewChild('searchInput')
  public readonly searchInput: ElementRef;

  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';

  public canSearch: boolean;

  private coinSearchSub: Subscription;

  constructor(private coinGeckoRepositoryService: CoinGeckoRepositoryService,
              private coinSearchManagerService: CoinSearchManagerService,
              private coinListManagerService: CoinListManagerService) {
  }

  ngOnInit(): void {
    this.coinSearchSub = this.coinListManagerService.coinsAsObservable().subscribe(coins => {
      setTimeout(()=>{
        this.canSearch = (coins && coins.length) ? true : false;

      }, 2000)
    }, error => {
      this.canSearch = false;
    }, () => {
      if (!this.canSearch) {
        throw new Error('Can not search for coins as could not retrieve the list.');
      }
    });
  }

  ngOnDestroy(): void {
    this.coinSearchSub.unsubscribe();
  }

  /**
   * Set a debounce time between typing two characters for filtering and fetching coins.
   */
  ngAfterViewInit(): void {
    this.inputObs = fromEvent(this.searchInput.nativeElement, 'keydown');
    this.inputObs.pipe(debounceTime(constants.MS_BETWEEN)).subscribe(() => {
      this.searchedCoin = this.searchedCoin.trim();
      this.coinSearchManagerService.nextSearch(this.searchedCoin);
    });
  }
}
