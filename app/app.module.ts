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
import {QuestionService} from "./services/question/question.service";
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
import {SurveyListComponent} from "./components/survey-list/survey-list.component";
import {EditSurveyComponent} from "./containers/edit-survey/edit-survey.component";
import {NewSurveyComponent} from "./containers/new-survey/new-survey.component";
import {ResultsComponent} from "./components/results/results.component";
import {RegisterComponent} from "./containers/register/register.component";
import {CreateUserComponent} from "./containers/create-user/create-user.component";
import {RegistrationService} from "./services/registration/registration.service";
import {RegistrationsComponent} from "./components/reigistrations/registrations.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {EditUserComponent} from "./containers/edit-user/edit-user.component";
import {ChangePasswordForm} from "./forms/change-password/change-password.form";
import {QuestionTemplateService} from "./services/question-template/question-template.service";
import {QuestionTemplateSearchComponent} from "./components/question-template-search/question-template-search.component";
import {SurveyStatisticsComponent} from "./components/survey-statistics/survey-statistics.component";
import {StatisticsService} from "./services/statistics/statistics.service";
import {QuestionStatisticsComponent} from "./components/question-statistics/question-statistics.component";

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
        QuestionForm, UserForm,
        FormErrorComponent, SurveyForm, SurveyInfoComponent, SurveyFillOutComponent, SurveyResultComponent,
        QuestionPagerComponent, QuestionComponent, AnswerComponent,
        NumericQuestionForm, TextQuestionForm, LongTextQuestionForm, ChooseOneQuestionForm, ChooseMultipleQuestionForm,
        NumericAnswerComponent, TextAnswerComponent, LongTextAnswerComponent, ChooseOneAnswerComponent, ChooseMultipleAnswerComponent,
        SurveyListComponent, EditSurveyComponent, NewSurveyComponent, ResultsComponent, RegisterComponent, CreateUserComponent,
        RegistrationsComponent, UserListComponent, EditUserComponent, ChangePasswordForm, QuestionTemplateSearchComponent,
        SurveyStatisticsComponent, QuestionStatisticsComponent
    ],
    bootstrap:    [ AppComponent ],
    providers: [
        ApiService, UserService, AuthService, QuestionService,
        UserFormValidator, SurveyService, SurveyFormValidator,
        ProgressService, AnswerService, RegistrationService,
        QuestionTemplateService, StatisticsService
    ]
})
export class AppModule { }
