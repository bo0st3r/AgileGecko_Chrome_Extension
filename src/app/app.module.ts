import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainTabComponent} from './layout/component/extension-tab/main-tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MatchCoinPipe} from './coin-market/pipe/matching-coin.pipe';
import {CoinSearchComponent} from './coin-market/component/coin-search/coin-search.component';
import {EthereumScannerComponent} from './chain-explorer/component/ethereum-scanner/ethereum-scanner.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FooterComponent} from './layout/component/footer/footer.component';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ExtensionHyperlinkComponent} from './chrome-tool/component/extension-hyperlink/extension-hyperlink.component';
import {HeaderComponent} from './layout/component/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MainTabComponent,
    MatchCoinPipe,
    CoinSearchComponent,
    EthereumScannerComponent,
    FooterComponent,
    ExtensionHyperlinkComponent,
    HeaderComponent,
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
