import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExtensionTabComponent } from './gui/component/extension-tab/extension-tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {InputTextModule, TooltipModule} from 'primeng';
import {MatchingCoinPipe} from './coingecko/pipe/matching-coin.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ExtensionTabComponent,
    MatchingCoinPipe
  ],
  imports: [
    TooltipModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
