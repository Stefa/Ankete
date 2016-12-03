import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './containers/app/app.component';
import { ApiService } from './services/api/api.service';
import {HttpModule} from "@angular/http";
import {UserService} from "./services/user/user.service";
import {AuthService} from "./services/authentication/auth.service";
import {LoginForm} from "./forms/login/login.form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import { HomeComponent } from './containers/home/home.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    declarations: [ AppComponent, LoginForm, HomeComponent, TopBarComponent ],
    bootstrap:    [ AppComponent ],
    providers: [
        ApiService, UserService, AuthService
    ]
})
export class AppModule { }
