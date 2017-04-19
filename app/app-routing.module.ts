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

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                // component: HomeComponent,
                // canActivate: [ParticipantGuard],
                redirectTo: 'test',
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
                resolve: {
                    surveys: SurveysResolverGuard
                }
            },
            {
                path: 'my-surveys',
                component: SurveyListComponent,
                resolve: {
                    surveys: UserSurveysResolverGuard
                }
            }
        ])
    ],
    exports: [RouterModule],
    providers: [
        ParticipantGuard, ClerkGuard,
        SurveyResolverGuard, ProgressResolverGuard, SurveysResolverGuard, UserSurveysResolverGuard
    ]
})
export class AppRoutingModule{}