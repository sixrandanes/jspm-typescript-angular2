/**
 * Created by Sylvain on 07/03/2016.
 */
import { Component, provide }       from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS,   LocationStrategy,
    HashLocationStrategy } from 'angular2/router';

import {APP_ROUTES} from './app.routes';

@Component({
    selector: 'my-app',
    templateUrl:'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]
})
@RouteConfig(APP_ROUTES)
export class AppComponent {

}