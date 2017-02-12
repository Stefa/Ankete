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
import {QuestionForm} from "./forms/question/question.form";
import {TestComponent} from "./containers/test/test.component";
import {QuestionService} from "./services/question/question.service";
import {TestForm} from "./forms/test/test.form";
import {UserForm} from "./forms/user/user.form";
import {MyDatePickerModule} from "mydatepicker";

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MyDatePickerModule
    ],
    declarations: [ AppComponent, LoginForm, HomeComponent, TopBarComponent, QuestionForm, TestComponent, TestForm, UserForm ],
    bootstrap:    [ AppComponent ],
    providers: [
        ApiService, UserService, AuthService, QuestionService
    ]
})
export class AppModule { }
