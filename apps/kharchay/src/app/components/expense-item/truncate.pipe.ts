import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, disabled: any): unknown {
    return disabled ? value : value.substring(0, 50);
  }
}
