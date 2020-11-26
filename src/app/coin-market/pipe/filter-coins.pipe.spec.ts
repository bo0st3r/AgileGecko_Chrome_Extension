import { FilterCoinsPipe } from './filter-coins.pipe';

describe('MatchingCoinPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterCoinsPipe();
    expect(pipe).toBeTruthy();
  });
});
