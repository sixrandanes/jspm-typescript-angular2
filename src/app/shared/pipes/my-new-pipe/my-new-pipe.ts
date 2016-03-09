import {Pipe, PipeTransform} from 'angular2/core';


@Pipe({
  name: 'myNewPipe'
})
export class MyNewPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
