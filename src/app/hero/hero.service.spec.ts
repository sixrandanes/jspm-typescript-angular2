import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {provide} from 'angular2/core';
import {HeroService} from './hero.service';

describe('HeroService', () => {

  beforeEachProviders(() => [HeroService]);

  it('should get all heros', inject([HeroService], (heroService:HeroService) => {
    heroService.getAll().then(heros => expect(heros.length).toBe(3));
  }));

  it('should get one hero', inject([HeroService], (heroService:HeroService) => {
    heroService.get(1).then(hero => expect(hero.id).toBe(1));
  }));

});
