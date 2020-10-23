import {Component} from '@angular/core';
import {etherscan} from '../../../../constants/etherscan';

@Component({
  selector: 'r-ethereum-scanner',
  templateUrl: './ethereum-scanner.component.html',
  styleUrls: ['./ethereum-scanner.component.css']
})
export class EthereumScannerComponent {
  // Constants
  public readonly etherscan = etherscan;

  /**
   * Value searched by user.
   */
  public searchValue = '';

  /**
   * User searching for an address.
   */
  public searchingAddress: boolean;

  /**
   * User searching for a transaction.
   */
  public searchingTx: boolean;

  /**
   * User searching for a block.
   */
  public searchingBlock: boolean;

  /**
   * Return {@link searchValue} normalized: length and format.
   */
  public normalizedSearchValue(): string {
    if (this.searchValue.length === 0) {
      return '';
    }

    const length = this.searchValue.length;
    if ([etherscan.TAB_TRANSACTION.TX_MIN_LENGTH, etherscan.TAB_TRANSACTION.TX_MIN_LENGTH + 1].includes(length)) {
      return this.searchValue.padStart(etherscan.TAB_TRANSACTION.TX_MAX_LENGTH, '0x');
    } else if ([etherscan.TAB_ADDRESS.ADDRESS_MIN_LENGTH, etherscan.TAB_ADDRESS.ADDRESS_MIN_LENGTH + 1].includes(length)) {
      return this.searchValue.padStart(etherscan.TAB_ADDRESS.ADDRESS_MAX_LENGTH, '0x');
    }

    return this.searchValue;
  }

  /**
   * Update the value of searching booleans: {@link searchingTx}, {@link searchingAddress}, {@link searchingBlock}.
   * @param newValue value for the tests
   */
  updateSearchingBools(newValue: string) {
    const newValueTrimmed = newValue.trim();
    const length = newValueTrimmed.length;
    this.searchingTx = length >= etherscan.TAB_TRANSACTION.TX_MIN_LENGTH && length <= etherscan.TAB_TRANSACTION.TX_MAX_LENGTH;
    this.searchingAddress = length >= etherscan.TAB_ADDRESS.ADDRESS_MIN_LENGTH && length <= etherscan.TAB_ADDRESS.ADDRESS_MAX_LENGTH;
    this.searchingBlock = length > 0 && !this.searchingTx && !this.searchingAddress;
  }

  public urlTokenResearch(): string {
    return etherscan.TABS.TOKEN + this.normalizedSearchValue();
  }

  public urlAddressResearch(): string {
    return etherscan.TABS.ADDRESS + this.normalizedSearchValue();
  }

  public urlBlockResearch(): string {
    return etherscan.TABS.BLOCK + this.normalizedSearchValue();
  }

  public urlTransactionResearch(): string {
    return etherscan.TABS.TRANSACTION + this.normalizedSearchValue();
  }
}
