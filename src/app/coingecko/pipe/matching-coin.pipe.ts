import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchingCoin'
})
export class MatchingCoinPipe implements PipeTransform {

  transform(value: unknown, args: unknown[]): unknown {
    return null;
  }

}
