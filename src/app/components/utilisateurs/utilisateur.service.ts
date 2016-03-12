import { Injectable } from 'angular2/core';

@Injectable()
export class UtilisateurService {

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