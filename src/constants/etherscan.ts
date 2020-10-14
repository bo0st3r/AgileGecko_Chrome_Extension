/**
 * Index page
 */
const HOST = 'https://www.etherscan.io/';

/**
 * Tabs URLs
 */
const TABS = {
  ADDRESS: HOST + 'address/',
  TOKEN: HOST + 'token/',
  TRANSACTION: HOST + 'tx/',
  BLOCK: HOST + 'block/',
};

/**
 * Address tab data
 */
const TAB_ADDRESS = {
  SUFFIXES: {
    CONTRACT: '#code',
    INTERNAL_TXS: '#internaltx',
    ERC20_TXS: '#tokentxns',
    LOANS: '#loansAddress',
  },
  ADDRESS_MIN_LENGTH: 40,
  ADDRESS_MAX_LENGTH: 42,
};

/**
 * Token tab data
 */
const TAB_TOKEN = {
  SUFFIXES: {
    HOLDERS: '#balances',
    WRITE_CONTRACT: '#writeContract',
    READ_CONTRACT: '#readContract',
  }
};

/**
 * Transaction tab data
 */
const TAB_TRANSACTION = {
  TX_MIN_LENGTH: 64,
  TX_MAX_LENGTH: 66,
};


export const etherscan = {
  HOST,
  TABS,
  TAB_ADDRESS,
  TAB_TOKEN,
  TAB_TRANSACTION
};

