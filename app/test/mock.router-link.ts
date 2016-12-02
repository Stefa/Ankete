import {Directive, Input} from '@angular/core'

@Directive({
    selector: '[routerLink]'
})
export class MockRouterLinkDirective {
    @Input('routerLink') linkParams: any;
}
