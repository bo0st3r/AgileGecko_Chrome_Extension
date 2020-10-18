import {Injectable} from '@angular/core';
import {snakeCase} from 'change-case';
import {HttpParams} from '@angular/common/http';
import {CaseStyle} from '../../typo-case/enum/case-style';

@Injectable({
  providedIn: 'root'
})
export class HttpOptionsGeneratorService {
  /**
   * Transform any Object's properties into a {@link HttpParams} with the given case style.
   * @param params list of params as any Object
   * @param caseStyle params' case style, default to {@link CaseStyle.CAMEL}
   */
  public httpParamsFromObject(params: any, caseStyle: CaseStyle = CaseStyle.CAMEL): HttpParams {
    if (!this.objectHasProperties(params)) {
      return null;
    }

    let httpParams = new HttpParams();

    // Append each entry with a defined value to httpParams
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (caseStyle == CaseStyle.SNAKE) {
        key = snakeCase(key);
      }

      httpParams = httpParams.append(key, value);
    });

    return httpParams;
  }

  private objectHasProperties(obj: any): boolean {
    const properties = Object.keys(obj);
    return obj && properties != null;
  }
}
