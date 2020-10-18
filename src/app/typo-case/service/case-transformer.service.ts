import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaseTransformerService {

  /**
   * Transforms a text from Snake Case to Camel Case and return it.
   * @param snakeString
   */
  public snakeStringToCamel(snakeString: string): string {
    if (!snakeString) {
      return null;
    }

    let camelString = '';
    let toUpperCase: boolean;
    // For every char in the property's name
    for (let snakeChar of snakeString) {
      if (snakeChar === '_') {
        toUpperCase = true;
      } else {
        if (toUpperCase) {
          snakeChar = snakeChar.toUpperCase();
        }
        camelString += snakeChar;
        toUpperCase = false;
      }
    }
    return camelString;
  }

  /**
   * Transforms an array of Snake Case strings to Camel Case and return it.
   * @param snakeStrings
   */
  public snakeStringArrayToCamel(snakeStrings: string[]): string[] {
    if (!snakeStrings || !snakeStrings.length) {
      return null;
    }

    let camelStrings = [];
    snakeStrings.forEach(key => {
      const camelKey = this.snakeStringToCamel(key);
      camelStrings.push(camelKey);
    });
    return camelStrings;
  }

  /**
   * Transform the given array pairs' first element from Snake Case to Camel Case.
   * E.g.:
   *  from [['snake_case', 5], ['test_random_key', 3]]
   *  to   [['snakeCase', 5], ['testRandomKey', 3]]
   * @param pairs
   */
  public snakeArrayOfPairsToCamel<T>(pairs: T[]): T[] {
    if (!pairs || !pairs.length) {
      return null;
    }

    const snakeKeys = Object.keys(pairs[0]);
    if (!snakeKeys || !snakeKeys.length) {
      return null;
    }

    const camelKeys = this.snakeStringArrayToCamel(snakeKeys);
    let camelPairs = [];
    pairs.forEach(pair => {
      let camelPair = {};
      Object.entries(pair).forEach((snakePair, index) => {
        const camelCaseKey = camelKeys[index];
        camelPair[camelCaseKey] = snakePair[1];
      });

      camelPairs.push(camelPair);
    });
    return camelPairs;
  }
}
