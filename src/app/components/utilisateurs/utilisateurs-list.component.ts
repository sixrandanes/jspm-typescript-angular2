import {Component} from 'angular2/core';
import { UtilisateurService } from './utilisateur.service';
import {Utilisateur} from "./utilisateur";


@Component({
  selector: 'utilisateurs',
  templateUrl: 'app/components/utilisateurs/utilisateurs.html',
  styleUrls: ['app/components/utilisateurs/utilisateurs.css'],
  directives: [],
  providers: [UtilisateurService],
  pipes: []
})
export class UtilisateursListComponent {

  heroes: Utilisateur[] = [];

  constructor(
      private _heroService: UtilisateurService) { }

  getUtilisateurs() {
    this._heroService.getUtilisateurs().then(heroes => this.heroes = heroes);
  }

}
