import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
export class Page {
    topNativeElement: any;
    constructor(public topDebugElement: DebugElement) {
        this.topNativeElement = topDebugElement.nativeElement;
    }

    protected getElementByCss(cssSelector: string) {
        let debugElement = this.getDebugElementByCss(cssSelector);
        return debugElement != null ? debugElement.nativeElement : null;
    }

    protected getElementFromHtml(cssSelector: string) {
        return this.topNativeElement.querySelector(cssSelector);
    }

    protected getDebugElementByCss(cssSelector: string) {
        return this.topDebugElement.query(By.css(cssSelector));
    }

    protected getAllDebugElementsByCss(cssSelector: string) {
        return this.topDebugElement.queryAll(By.css(cssSelector));
    }

    protected setInput(inputElement, value) {
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input'));
    }

    protected setSelect(selectElement, value) {
        selectElement.value = value;
        selectElement.dispatchEvent(new Event('change'));
    }

    protected click(element: DebugElement, event = new Event('click')) {
        element.triggerEventHandler('click', event);
    }
}
