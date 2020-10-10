import {Component, OnInit} from '@angular/core';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';
import {Url} from '../../../coingecko/enum/url.enum';
import {HttpClient} from '@angular/common/http';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'r-ethereum-scanner',
  templateUrl: './ethereum-scanner.component.html',
  styleUrls: ['./ethereum-scanner.component.css']
})
export class EthereumScannerComponent implements OnInit {
  public Url = Url;
  public ADDRESS_PREFIX = 'address/';
  public TOKEN_PREFIX = 'token/';
  public TRANSACTION_PREFIX = 'tx/';
  public BLOCK_PREFIX = 'block/';

  public ADDRESS_CONTRACT_SUFFIX = '#code';
  public ADDRESS_INTERNAL_TXNS_SUFFIX = '#internaltx';
  public ADDRESS_ERC20_TXNS_SUFFIX = '#tokentxns';
  public ADDRESS_LOANS_SUFFIX = '#loansAddress';
  public TOKEN_HOLDERS_SUFFIX = '#balances';
  public TOKEN_WRITE_CONTRACT_SUFFIX = '#writeContract';
  public TOKEN_READ_CONTRACT_SUFFIX = '#readContract';

  private ADDRESS_MIN_LENGTH = 40;
  private ADDRESS_MAX_LENGTH = 42;
  private TRANSACTION_MIN_LENGTH = 64;
  private TRANSACTION_MAX_LENGTH = 66;

  public searchValue = '';
  public searchingAddress: boolean;
  public searchingTx: boolean;
  public searchingBlock: boolean;



  constructor(public tabManagerService: TabManagerService) {
  }

  ngOnInit(): void {
  }

  public urlTokenResearch(): string {
    return Url.ETHERSCAN_ADDRESS + this.TOKEN_PREFIX + this.normalizedSearchValue();
  }

  public urlAddressResearch(): string {
    return Url.ETHERSCAN_ADDRESS + this.ADDRESS_PREFIX + this.normalizedSearchValue();
  }

  public urlBlockResearch(): string {
    return Url.ETHERSCAN_ADDRESS + this.BLOCK_PREFIX + this.normalizedSearchValue();
  }

  public urlTransactionResearch(): string {
    return Url.ETHERSCAN_ADDRESS + this.TRANSACTION_PREFIX + this.normalizedSearchValue();
  }

  public normalizedSearchValue(): string{
    if(this.searchValue.length === 0)
      return '';

    const length = this.searchValue.length;
    if([this.TRANSACTION_MIN_LENGTH, this.TRANSACTION_MIN_LENGTH + 1].includes(length))
      return this.searchValue.padStart(this.TRANSACTION_MAX_LENGTH, '0x');
    else if([this.ADDRESS_MIN_LENGTH, this.ADDRESS_MIN_LENGTH + 1].includes(length))
      return this.searchValue.padStart(this.ADDRESS_MAX_LENGTH, '0x');

    return this.searchValue;
  }

  updateSearchingBools(newValue: string) {
    const newValueTrimmed = newValue.trim();
    const length = newValueTrimmed.length;
    this.searchingTx = length >= this.TRANSACTION_MIN_LENGTH && length <= this.TRANSACTION_MAX_LENGTH;
    this.searchingAddress = length >= this.ADDRESS_MIN_LENGTH && length <= this.ADDRESS_MAX_LENGTH;
    this.searchingBlock = length > 0 && length < this.ADDRESS_MIN_LENGTH;
  }
}
