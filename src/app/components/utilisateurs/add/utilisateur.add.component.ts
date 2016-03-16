import {OnInit, Component} from 'angular2/core';
import { UtilisateurService } from './../utilisateur.service.ts';
import {Utilisateur} from "./../utilisateur";
import { Router } from 'angular2/router';


@Component({
  selector: 'utilisateurs-add',
  templateUrl: 'app/components/utilisateurs/add/utilisateur.add.html',
  styleUrls: ['app/components/utilisateurs/add/utilisateur.add.css'],
  directives: [],
  providers: [UtilisateurService],
  pipes: []
})
export class UtilisateurAddComponent implements OnInit {

  heroes: Utilisateur[] = [];

  constructor(private _router: Router,
      private _heroService: UtilisateurService) { }

  ngOnInit() {
    this._heroService.getUtilisateurs().then(heroes => this.heroes = heroes);
  }

  getUtilisateurs() {
    this._heroService.getUtilisateurs().then(heroes => this.heroes = heroes);
  }

  addUtilisateur() {
    this._router.navigate(['HeroDetail']);
  }
}
