import {OnInit, Component} from 'angular2/core';
import { UtilisateurService } from './utilisateur.service';
import {Utilisateur} from './utilisateur';
import { Router } from 'angular2/router';


@Component({
  selector: 'sg-utilisateurs',
  templateUrl: 'app/components/utilisateurs/utilisateurs-list.html',
  styleUrls: ['app/components/utilisateurs/utilisateurs-list.css'],
  directives: [],
  providers: [UtilisateurService],
  pipes: []
})
export class UtilisateursListComponent implements OnInit {

  errorMessage: string;
  heroes: Utilisateur[] = [];

  constructor(private router: Router,
      private heroService: UtilisateurService) { }

  ngOnInit() {
    this.heroService.getUtilisateurs()
        .subscribe(
          res => this.heroes = res._embedded.utilisateurs,
          error =>  this.errorMessage = <any>error);
  }

  addUtilisateur() {
    this.router.navigate(['UtilisateursNew']);
  }
}
