import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from './forms/login/login.form';
import { HomeComponent } from './containers/home/home.component';

import { ParticipantGuard } from './guards/participant/participant.guard';
import {TestComponent} from "./containers/test/test.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: HomeComponent,
                canActivate: [ParticipantGuard]
            },
            { path: 'login', component: LoginForm },
            { path: 'test', component: TestComponent }
        ])
    ],
    exports: [RouterModule],
    providers: [ParticipantGuard]
})
export class AppRoutingModule{}