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
import {FormErrorComponent} from "./components/form-error/form-error.component";
import {UserFormValidator} from "./form-validators/user/user.form-validator";
import {DragulaModule} from "ng2-dragula";
import {SurveyForm} from "./forms/survey/survey.form";
import {SurveyService} from "./services/survey/survey.service";
import {SurveyFormValidator} from "./form-validators/survey/survey.form-validator";
import {SurveyInfoComponent} from "./components/survey-info/survey-info.component";
import {ProgressService} from "./services/progress/progress.service";
import {AnswerService} from "./services/answer/answer.service";
import {SurveyFillOutComponent} from "./components/survey-fill-out/survey-fill-out.component";
import {SurveyResultComponent} from "./components/survey-result/survey-result.component";

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MyDatePickerModule,
        DragulaModule
    ],
    declarations: [
        AppComponent, LoginForm, HomeComponent, TopBarComponent,
        QuestionForm, TestComponent, TestForm, UserForm,
        FormErrorComponent, SurveyForm, SurveyInfoComponent, SurveyFillOutComponent, SurveyResultComponent
    ],
    bootstrap:    [ AppComponent ],
    providers: [
        ApiService, UserService, AuthService, QuestionService,
        UserFormValidator, SurveyService, SurveyFormValidator,
        ProgressService, AnswerService
    ]
})
export class AppModule { }
