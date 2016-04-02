/**
 * Created by Sylvain on 12/03/2016.
 */
import {RouteDefinition} from 'angular2/router';
import { UtilisateursListComponent } from './components/utilisateurs/utilisateurs-list.component';
import { UtilisateurAddComponent } from './components/utilisateurs/add/utilisateur.add.component';
import { AchatsListComponent } from './components/achats/achats-list.component';
import { ProduitsListComponent } from './components/produits/produits-list.component';

export var APP_ROUTES: RouteDefinition[] = [
    {
        path: '/utilisateurs',
        name: 'Utilisateurs',
        component: UtilisateursListComponent,
        useAsDefault: true
    },
    {
        path: '/utilisateurs/new',
        name: 'UtilisateursNew',
        component: UtilisateurAddComponent
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
];
