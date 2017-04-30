import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from './forms/login/login.form';
import { HomeComponent } from './containers/home/home.component';

import { ParticipantGuard } from './guards/participant/participant.guard';
import {TestComponent} from "./containers/test/test.component";
import {SurveyInfoComponent} from "./components/survey-info/survey-info.component";
import {SurveyResolverGuard} from "./guards/survey-resolver/survey-resolver.guard";
import {ProgressResolverGuard} from "./guards/progress-resolver/progress-resolver.guard";
import {ClerkGuard} from "./guards/clerk/clerk.guard";
import {SurveyFillOutComponent} from "./components/survey-fill-out/survey-fill-out.component";
import {SurveyResultComponent} from "./components/survey-result/survey-result.component";
import {SurveyListComponent} from "./components/survey-list/survey-list.component";
import {SurveysResolverGuard} from "./guards/surveys-resolver/surveys-resolver.guard";
import {UserSurveysResolverGuard} from "./guards/user-surveys-resolver/user-surveys-resolver.guard";
import {AuthorGuard} from "./guards/author/author.guard";
import {AdministratorGuard} from "./guards/administrator/administrator.guard";
import {SurveyEditGuard} from "./guards/survey-edit/survey-edit.guard";
import {EditSurveyComponent} from "./containers/edit-survey/edit-survey.component";
import {NewSurveyComponent} from "./containers/new-survey/new-survey.component";
import {ResultsComponent} from "./components/results/results.component";
import {FinishedProgressResolverGuard} from "./guards/finished-progress-resolver/finished-progress-resolver.guard";
import {SurveyResultsGuard} from "./guards/survey-results/survey-results.guard";
import {RegisterComponent} from "./containers/register/register.component";
import {CreateUserComponent} from "./containers/create-user/create-user.component";
import {RegistrationsResolverGuard} from "./guards/registrations-resolver/registrations-resolver.guard";
import {RegistrationsComponent} from "./components/reigistrations/registrations.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                // component: HomeComponent,
                redirectTo: 'surveys',
                pathMatch: 'full'
            },
            { path: 'login', component: LoginForm },
            { path: 'test', component: TestComponent },
            {
                path: 'survey/:surveyId',
                canActivate: [ParticipantGuard],
                resolve: {
                    survey: SurveyResolverGuard
                },
                children: [
                    {
                        path: 'info',
                        component: SurveyInfoComponent,
                        resolve: {
                            progress: ProgressResolverGuard
                        }
                    },
                    {
                        path: 'fill-out',
                        component: SurveyFillOutComponent,
                        resolve: {
                            progress: ProgressResolverGuard
                        }
                    },
                    {
                        path: 'result',
                        component: SurveyResultComponent,
                        resolve: {
                            progress: ProgressResolverGuard
                        }
                    }
                ]
            },
            {
                path: 'survey-proxy/:surveyId',
                canActivate: [ClerkGuard],
                data: {proxy: true},
                resolve: {
                    survey: SurveyResolverGuard
                },
                children: [
                    {
                        path: 'info',
                        component: SurveyInfoComponent
                    },
                    {
                        path: 'fill-out/:progressId',
                        component: SurveyFillOutComponent,
                        resolve: {
                            progress: ProgressResolverGuard
                        }
                    },
                    {
                        path: 'result/:progressId',
                        component: SurveyResultComponent,
                        resolve: {
                            progress: ProgressResolverGuard
                        }
                    }
                ]
            },
            {
                path: 'surveys',
                component: SurveyListComponent,
                canActivate: [ParticipantGuard],
                resolve: {
                    surveys: SurveysResolverGuard
                }
            },
            {
                path: 'my-surveys',
                component: SurveyListComponent,
                canActivate: [AuthorGuard],
                resolve: {
                    surveys: UserSurveysResolverGuard
                },
                data: {
                    'mySurveys': true
                }
            },
            {
                path: 'new-survey',
                component: NewSurveyComponent,
                canActivate: [AuthorGuard]
            },
            {
                path: 'edit-survey/:surveyId',
                component: EditSurveyComponent,
                canActivate: [AuthorGuard, SurveyEditGuard],
                resolve: {
                    survey: SurveyResolverGuard
                }
            },
            {
                path: 'results/:surveyId',
                component: ResultsComponent,
                canActivate: [AuthorGuard, SurveyResultsGuard],
                resolve: {
                    survey: SurveyResolverGuard,
                    results: FinishedProgressResolverGuard
                }
            },
            {
                path: 'result/:surveyId/:progressId',
                component: SurveyResultComponent,
                canActivate: [AuthorGuard, SurveyResultsGuard],
                resolve: {
                    survey: SurveyResolverGuard,
                    progress: ProgressResolverGuard
                }
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'create-user',
                component: CreateUserComponent,
                canActivate: [AdministratorGuard]
            },
            {
                path: 'registrations',
                component: RegistrationsComponent,
                canActivate: [AdministratorGuard],
                resolve: {
                    registrations: RegistrationsResolverGuard
                }
            }
        ])
    ],
    exports: [RouterModule],
    providers: [
        ParticipantGuard, ClerkGuard, AuthorGuard, AdministratorGuard, SurveyEditGuard,
        SurveyResolverGuard, ProgressResolverGuard, SurveysResolverGuard, UserSurveysResolverGuard,
        FinishedProgressResolverGuard, SurveyResultsGuard, RegistrationsResolverGuard
    ]
})
export class AppRoutingModule{}