import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from './forms/login/login.form';
import { HomeComponent } from './containers/home/home.component';

import { ParticipantGuard } from './guards/participant/participant.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: HomeComponent,
                canActivate: [ParticipantGuard]
            },
            { path: 'login', component: LoginForm }
        ])
    ],
    exports: [RouterModule],
    providers: [ParticipantGuard]
})
export class AppRoutingModule{}