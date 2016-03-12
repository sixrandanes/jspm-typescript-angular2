import {OnInit, Component} from 'angular2/core';
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
export class UtilisateursListComponent implements OnInit {

  heroes: Utilisateur[] = [];

  constructor(
      private _heroService: UtilisateurService) { }

  ngOnInit() {
    this._heroService.getUtilisateurs().then(heroes => this.heroes = heroes);
  }

  getUtilisateurs() {
    this._heroService.getUtilisateurs().then(heroes => this.heroes = heroes);
  }
}
