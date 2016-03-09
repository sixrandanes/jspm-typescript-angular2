import {Component} from 'angular2/core';
import {CrisisService} from './utilisateur.service.ts';


@Component({
  selector: 'utilisateurs',
  templateUrl: 'app/components/utilisateurs/utilisateurs.html',
  styleUrls: ['app/components/utilisateurs/utilisateurs.css'],
  providers:  [CrisisService],
  directives: [],
  pipes: []
})
export class UtilisateursListComponent {

  constructor() {}

}
