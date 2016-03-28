import { Injectable } from 'angular2/core';
import {ControlGroup} from "angular2/common";
import {Http, Headers, Response, RequestOptions} from 'angular2/http';


@Injectable()
export class UtilisateurService {

    constructor(public http: Http) {}

    getUtilisateurs() {
        const test = [
            {"id": 11, "name": "Mr. Nice"},
            {"id": 12, "name": "Narco"},
            {"id": 13, "name": "Bombasto"},
            {"id": 14, "name": "Celeritas"},
            {"id": 15, "name": "Magneta"},
            {"id": 16, "name": "RubberMan"},
            {"id": 17, "name": "Dynama"},
            {"id": 18, "name": "Dr IQ"},
            {"id": 19, "name": "Magma"},
            {"id": 20, "name": "Tornado"}
        ];
        return Promise.resolve(test);
    }

    addUtilisateur(form:ControlGroup) {

        const test = {"username": form.value.firstName, "password":form.value.password};
        const lul = JSON.stringify(test);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });


        return this.http.post('http://localhost:8080/users', lul, options)
            .subscribe(res => {
               /// this.comments = res.json();
            });
         //   .toPromise()
         //   .catch(this.handleError);
    }

    private handleError (error: any) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Promise.reject(error.message || error.json().error || 'Server error');
    }

    // See the "Take it slow" appendix
    /*  getHeroesSlowly() {
     return new Promise<Hero[]>(resolve =>
     setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
     );
     }

     getHero(id: number) {
     return Promise.resolve(HEROES).then(
     heroes => heroes.filter(hero => hero.id === id)[0]
     );
     }*/
}