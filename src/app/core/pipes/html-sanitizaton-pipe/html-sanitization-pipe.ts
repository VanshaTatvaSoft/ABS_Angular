import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'htmlSanitization'
})
export class HtmlSanitizationPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): unknown {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
