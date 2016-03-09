import {Component, OnInit} from 'angular2/core';
import {Hero, HeroService} from './hero.service';
import {RouteParams, Router} from 'angular2/router';
import {CanDeactivate, ComponentInstruction} from 'angular2/router';

@Component({
  templateUrl: 'app/hero/hero-detail.component.html',
  styleUrls: ['app/hero/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, CanDeactivate {

  hero: Hero;
  editName: string;

  constructor(
    private _service: HeroService,
    private _router: Router,
    private _routeParams: RouteParams
    ) { }

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._service.get(id).then(hero => {
      if (hero) {
        this.editName = hero.name;
        this.hero = hero;
      } else {
        this.gotoList();
      }
    });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.hero || this.hero.name === this.editName) {
      return true;
    }

    return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
  }

  cancel() {
    this.editName = this.hero.name;
    this.gotoList();
  }

  save() {
    this.hero.name = this.editName;
    this.gotoList();
  }

  gotoList() {
    this._router.navigate(['HeroList']);
  }
}
