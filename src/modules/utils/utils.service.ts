// utils.ts
import { Injectable } from '@nestjs/common';
import { camelCase, snakeCase, mapKeys } from 'lodash';

@Injectable()
export class UtilsService {
  convertObjectKeys(obj: any, convertFn: (key: string) => string): any {
    return mapKeys(obj, (_, key) => convertFn(key));
  }

  snakeCase(key: string): string {
    return key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
  }
}
