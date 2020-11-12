import { FilterCoinPipe } from './matching-coin.pipe';

describe('MatchingCoinPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterCoinPipe();
    expect(pipe).toBeTruthy();
  });
});
