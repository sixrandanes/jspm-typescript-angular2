import { Injectable } from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Http, Headers, RequestOptions} from 'angular2/http';
import 'rxjs/Rx';


@Injectable()
export class UtilisateurService {

    constructor(public http: Http) {}

    getUtilisateurs() {
        return this.http.get('http://localhost:8083/utilisateurs')
            .map(res =>  res.json())
            .catch(this.handleError);
    }

    addUtilisateur(form: ControlGroup) {
        const test = {'username': form.value.firstName, 'password': form.value.password};
        const lul = JSON.stringify(test);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8083/utilisateurs', lul, options);
    }

    private handleError (error: any) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Promise.reject(error.message || error.json().error || 'Server error');
    }
}
