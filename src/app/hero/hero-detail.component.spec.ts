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
import {HeroDetailComponent} from './hero-detail.component';
import {Router, RouteParams} from 'angular2/router';
import {Hero, HeroService} from './hero.service';

class MockHeroService {
  get() { return Promise.resolve(new Hero(1, 'one')); }
}

class MockRouter {
  navigate() { }
}

class MockRouteParams {
  get() { return 1; }
}

describe('HeroDetailComponent', () => {

  beforeEachProviders(() => [
    provide(HeroService, {useClass: MockHeroService}),
    provide(Router, {useClass: MockRouter}),
    provide(RouteParams, {useClass: MockRouteParams}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(HeroDetailComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
