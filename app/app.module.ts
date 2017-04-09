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
import {UnoForm} from "./forms/test/uno/uno.form";
import {DosForm} from "./forms/test/dos/dos.form";
import {QuestionPagerComponent} from "./components/question-pager/question-pager.component";
import {QuestionComponent} from "./components/question/question.component";
import {NumericQuestionForm} from "./forms/survey-fill-out/numeric-question/numeric-question.form";
import {TextQuestionForm} from "./forms/survey-fill-out/text-question/text-question.form";
import {LongTextQuestionForm} from "./forms/survey-fill-out/long-text-question/long-text-question.form";
import {ChooseOneQuestionForm} from "./forms/survey-fill-out/choose-one-question/choose-one-question.form";
import {ChooseMultipleQuestionForm} from "./forms/survey-fill-out/choose-multiple-question/choose-multiple-question.form";
import {AnswerComponent} from "./components/answer/answer.component";
import {NumericAnswerComponent} from "./components/survey-result-answers/numeric-answer/numeric-answer.component";
import {TextAnswerComponent} from "./components/survey-result-answers/text-answer/text-answer.component";
import {LongTextAnswerComponent} from "./components/survey-result-answers/long-text-answer/long-text-answer.component";
import {ChooseOneAnswerComponent} from "./components/survey-result-answers/choose-one-answer/choose-one-answer.component";
import {ChooseMultipleAnswerComponent} from "./components/survey-result-answers/choose-multiple-answer/choose-multiple-answer.component";

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
        FormErrorComponent, SurveyForm, SurveyInfoComponent, SurveyFillOutComponent, SurveyResultComponent,
        UnoForm, DosForm, QuestionPagerComponent, QuestionComponent, AnswerComponent,
        NumericQuestionForm, TextQuestionForm, LongTextQuestionForm, ChooseOneQuestionForm, ChooseMultipleQuestionForm,
        NumericAnswerComponent, TextAnswerComponent, LongTextAnswerComponent, ChooseOneAnswerComponent, ChooseMultipleAnswerComponent
    ],
    bootstrap:    [ AppComponent ],
    providers: [
        ApiService, UserService, AuthService, QuestionService,
        UserFormValidator, SurveyService, SurveyFormValidator,
        ProgressService, AnswerService
    ]
})
export class AppModule { }
