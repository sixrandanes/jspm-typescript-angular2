/**
 * Created by Sylvain on 07/03/2016.
 */
import { Component }       from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {HeroService} from "./hero/hero.service";
import { UtilisateursListComponent } from './components/utilisateurs/utilisateurs-list.component';
import { AchatsListComponent } from './components/achats/achats-list.component';
import { ProduitsListComponent } from './components/produits/produits-list.component';

@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['Utilisateurs']">Utilisateurs</a>
      <a [routerLink]="['Produits']">Produits</a>
      <a [routerLink]="['Achats']">Achats</a>
    </nav>
    <router-outlet></router-outlet>
  `,
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        HeroService
    ]
})
@RouteConfig([
    {
        path: '/utilisateurs',
        name: 'Utilisateurs',
        component: UtilisateursListComponent,
        useAsDefault: true
    },
    {
        path: '/produits',
        name: 'Produits',
        component: ProduitsListComponent
    },
    {
        path: '/achats',
        name: 'Achats',
        component: AchatsListComponent
    }
])
export class AppComponent {
    title = 'Tour of Heroes';
}