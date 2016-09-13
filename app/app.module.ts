import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './components/app.component';
import { ApiService } from './services/api/ApiService';
import {HttpModule} from "@angular/http";
@NgModule({
    imports:      [ BrowserModule, HttpModule],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ],
    providers: [ApiService]
})
export class AppModule { }
