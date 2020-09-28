import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ExtensionTabComponent} from './layout/component/extension-tab/extension-tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MatchCoinPipe} from './coingecko/pipe/matching-coin.pipe';
import {CoinSearchComponent} from './coingecko/component/coin-search/coin-search.component';
import {EthereumScannerComponent} from './chain-explorer/component/ethereum-scanner/ethereum-scanner.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InfoFooterComponent} from './layout/component/info-footer/info-footer.component';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ExtensionHyperlinkComponent} from './small-component/component/extension-hyperlink/extension-hyperlink.component';

@NgModule({
  declarations: [
    AppComponent,
    ExtensionTabComponent,
    MatchCoinPipe,
    CoinSearchComponent,
    EthereumScannerComponent,
    InfoFooterComponent,
    ExtensionHyperlinkComponent,
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
    BrowserAnimationsModule,
    RadioButtonModule,
  ],
  providers: [
    MatchCoinPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
