import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExtensionTabComponent } from './gui/component/extension-tab/extension-tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {InputTextModule, TooltipModule} from 'primeng';
import {MatchCoinPipe} from './coingecko/pipe/matching-coin.pipe';
import {TabManagerService} from './chrome/util/tab-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    ExtensionTabComponent,
    MatchCoinPipe,
  ],
  imports: [
    TooltipModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    InputTextModule
  ],
  providers: [
    MatchCoinPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
