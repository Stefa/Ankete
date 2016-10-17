import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './components/app.component';
import { ApiService } from './services/api/ApiService';
import {HttpModule} from "@angular/http";
import {UserService} from "./services/user/UserService";
import {AuthService} from "./services/authentication/AuthService";
import {LoginForm} from "./forms/login/LoginForm";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
@NgModule({
    imports:      [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
    declarations: [ AppComponent, LoginForm ],
    bootstrap:    [ AppComponent ],
    providers: [ApiService, UserService, AuthService]
})
export class AppModule { }
