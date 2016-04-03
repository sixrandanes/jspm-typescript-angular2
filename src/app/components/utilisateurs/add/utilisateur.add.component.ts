import {Component} from 'angular2/core';
import { UtilisateurService } from './../utilisateur.service.ts';
import { ControlGroup, Control, FormBuilder, Validators, NgFormModel} from 'angular2/common';
import { Router } from 'angular2/router';


@Component({
  selector: 'sg-utilisateurs-add',
  templateUrl: 'app/components/utilisateurs/add/utilisateur.add.html',
  styleUrls: ['app/components/utilisateurs/add/utilisateur.add.css'],
  directives: [],
  providers: [UtilisateurService],
  pipes: []
})
export class UtilisateurAddComponent {

  form: ControlGroup;
  firstName: Control = new Control('', Validators.required);

  constructor(fb: FormBuilder, private userService: UtilisateurService, private router: Router,) {
    this.form = fb.group({
      'firstName': this.firstName,
      'password': ['', Validators.required]
    });
  }

  saveUser() {
    this.userService.addUtilisateur(this.form)
        .subscribe();
  }

  retour() {
    this.router.navigate(['Utilisateurs']);
  }
}
