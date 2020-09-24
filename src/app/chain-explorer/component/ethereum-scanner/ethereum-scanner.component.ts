import {Component, OnInit} from '@angular/core';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {Url} from '../../../coingecko/enum/url.enum';
import {HttpClient} from '@angular/common/http';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'app-ethereum-scanner',
  templateUrl: './ethereum-scanner.component.html',
  styleUrls: ['./ethereum-scanner.component.css']
})
export class EthereumScannerComponent implements OnInit {
  public Url = Url;
  public searchPrefix: string;
  public ADDRESS_PREFIX = 'address/';
  public TOKEN_PREFIX = 'token/';
  public TRANSACTION_PREFIX = 'tx/';

  public searchSuffix: string;
  public ADDRESS_CONTRACT_SUFFIX = '#code';
  public TOKEN_HOLDERS_SUFFIX = '#balances';

  public searchAddress: string;
  public searchUrl: string;

  constructor(public tabManagerService: TabManagerService) {
  }

  ngOnInit(): void {
  }

  public updateSearchUrl(): void {
    // with or without 0x
    // address or token
    // nothing, contract or holders
    // result
    this.searchUrl = this.searchPrefix + this.searchAddress;
  }
}
