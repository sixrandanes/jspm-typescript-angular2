import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {HeroListComponent} from './hero-list.component';
import {Hero, HeroService} from './hero.service';

class MockHeroService {
  getAll() { return Promise.resolve([new Hero(1, 'one')]); }
}

describe('HeroListComponent', () => {

  beforeEachProviders(() => [
    provide(HeroService, {useClass: MockHeroService}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(HeroListComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
