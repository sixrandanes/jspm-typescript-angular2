import {Injectable} from 'angular2/core';

export class Hero {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class HeroService {
  getAll() { return promise; }
  get(id: number) {
    return promise.then(all => all.find(e => e.id === id));
  }
}

let mock = [
  new Hero(1, 'one'),
  new Hero(2, 'two'),
  new Hero(3, 'three')
];

let promise = Promise.resolve(mock);
