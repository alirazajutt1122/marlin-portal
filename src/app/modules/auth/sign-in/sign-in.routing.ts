import {Route} from '@angular/router';
import {AuthSignInComponent} from 'app/modules/auth/sign-in/sign-in.component';
import {AuthResolvers} from "./auth.resolvers";

export const authSignInRoutes: Route[] = [
    {
        path: '',
        component: AuthSignInComponent,
        resolve: {
            data: AuthResolvers,
        },
    }
];
