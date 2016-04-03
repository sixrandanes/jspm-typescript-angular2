/**
 * Created by Sylvain on 07/03/2016.
 */

// import 'angular2/bundles/angular2-polyfills.min';

import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/Rx';

bootstrap(AppComponent, [HTTP_PROVIDERS]);
