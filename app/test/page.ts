import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
export class Page {
    topNativeElement: any;
    constructor(public topDebugElement: DebugElement) {
        this.topNativeElement = topDebugElement.nativeElement;
    }

    protected getElementByCss(cssSelector: string): any {
        let debugElement = this.getDebugElementByCss(cssSelector);
        return debugElement != null ? debugElement.nativeElement : null;
    }

    protected getElementFromHtml(cssSelector: string): any {
        return this.topNativeElement.querySelector(cssSelector);
    }

    protected getDebugElementByCss(cssSelector: string): DebugElement {
        return this.topDebugElement.query(By.css(cssSelector));
    }

    protected getAllDebugElementsByCss(cssSelector: string): Array<DebugElement> {
        return this.topDebugElement.queryAll(By.css(cssSelector));
    }

    protected getAllElementsByCss(cssSelector: string): Array<any> {
        return this.getAllDebugElementsByCss(cssSelector)
            .map(element => element.nativeElement);
    }

    protected setInput(inputElement, value) {
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input'));
    }

    protected setSelect(selectElement, value) {
        selectElement.value = value;
        selectElement.dispatchEvent(new Event('change'));
    }

    protected setDate(dateInput, date) {
        dateInput.value = date;
        dateInput.dispatchEvent(new Event('keyup'));
    }

    protected click(element: DebugElement, event = new Event('click')) {
        element.triggerEventHandler('click', event);
    }
}
