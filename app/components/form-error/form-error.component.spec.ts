import {async, TestBed, ComponentFixture} from "@angular/core/testing";
import {FormErrorComponent} from "./form-error.component";

describe('FormErrorComponent', () => {
    let fixture: ComponentFixture<FormErrorComponent>;
    let comp: FormErrorComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [ FormErrorComponent ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(FormErrorComponent);
                comp    = fixture.componentInstance;
            });
    }));

    it('should display error with provided class and message', () => {
        let css = 'user-type';
        let message = 'Izaberite tip korisnika.';
        comp.error = {css: css, message: message};
        fixture.detectChanges();
        let cssClass = '.ui.mini.error.message.'+css;
        let errorElement  = fixture.debugElement.nativeElement.querySelector(cssClass);
        expect(errorElement).toBeDefined();
        expect(errorElement.innerHTML).toContain(message);
    });

    it('should not display error if message is not provided', () => {
        let css = 'user-type';
        let message = '';
        comp.error = {css: css, message: message};
        fixture.detectChanges();
        let errorElement  = fixture.debugElement.nativeElement.querySelector('div');
        expect(errorElement).toBeNull();
    });
});
