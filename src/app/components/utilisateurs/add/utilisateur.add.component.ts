import {Component} from 'angular2/core';
import { UtilisateurService } from './../utilisateur.service.ts';
import { ControlGroup, Control, FormBuilder, Validators} from 'angular2/common';


@Component({
  selector: 'utilisateurs-add',
  templateUrl: 'app/components/utilisateurs/add/utilisateur.add.html',
  styleUrls: ['app/components/utilisateurs/add/utilisateur.add.css'],
  directives: [],
  providers: [UtilisateurService],
  pipes: []
})
export class UtilisateurAddComponent{

  form: ControlGroup;
  firstName: Control = new Control("", Validators.required);

  constructor(fb: FormBuilder, private _userService: UtilisateurService) {
    this.form = fb.group({
      "firstName": this.firstName,
      "password":["", Validators.required]
    });
  }

  onSubmitModelBased() {
    this._userService.addUtilisateur(this.form)
        .subscribe();
  }
}