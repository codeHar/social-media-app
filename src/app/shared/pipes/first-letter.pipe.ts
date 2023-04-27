import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(label: string): any {
    return label[0].toUpperCase() || 'R';
  }

}


@NgModule({
  declarations: [FirstLetterPipe],
  exports: [FirstLetterPipe]
})
export class FirstLetterModule{}
