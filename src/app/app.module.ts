import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExtensionTabComponent } from './layout/component/extension-tab/extension-tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {DialogModule, InputTextModule, TableModule, TabViewModule, TooltipModule} from 'primeng';
import {MatchCoinPipe} from './coingecko/pipe/matching-coin.pipe';
import {TabManagerService} from './chrome/util/tab-manager.service';
import { CoinSearchComponent } from './coingecko/component/coin-search/coin-search.component';
import { EthereumScannerComponent } from './chain-explorer/component/ethereum-scanner/ethereum-scanner.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ExtensionTabComponent,
    MatchCoinPipe,
    CoinSearchComponent,
    EthereumScannerComponent,
  ],
  imports: [
    TooltipModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    TableModule,
    TabViewModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    MatchCoinPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
