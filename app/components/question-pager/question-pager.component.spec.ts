import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {QuestionPagerComponent} from "./question-pager.component";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {QuestionPagerComponentPage} from "./question-pager.component.page";

describe('QuestionPager', () => {
    let fixture: ComponentFixture<QuestionPagerComponent>;
    let comp: QuestionPagerComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [QuestionPagerComponent],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(QuestionPagerComponent);
                comp    = fixture.componentInstance;
            });
    }));

    it('should show previous page button', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        let previousButton = fixture.debugElement.query(By.css('.question-pager-previous'));
        expect(previousButton instanceof DebugElement).toBe(true);
    });

    it('should show next page button', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        let nextButton = fixture.debugElement.query(By.css('.question-pager-next'));
        expect(nextButton instanceof DebugElement).toBe(true);
    });

    it('should show current page', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        let currentPageButton = fixture.debugElement.query(By.css('.question-pager-current-page'));
        expect(currentPageButton instanceof DebugElement).toBe(true);
        expect(currentPageButton.nativeElement.innerHTML).toContain('1');
    });

    it('should disable previous page button if on first page', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        expect(comp.previousButtonDisabled).toBe(true);
    });

    it('should disable next page button if on last page', () => {
        comp.totalPages = 5;
        comp.currentPage = 5;
        fixture.detectChanges();
        expect(comp.nextButtonDisabled).toBe(true);
    });

    it('should increment page when next page button is clicked', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        let page = new QuestionPagerComponentPage(fixture.debugElement);
        page.next();
        expect(comp.currentPage).toBe(2);
    });

    it('should decrement page when previous page button is clicked', () => {
        comp.totalPages = 5;
        comp.currentPage = 3;
        fixture.detectChanges();
        let page = new QuestionPagerComponentPage(fixture.debugElement);
        page.previous();
        expect(comp.currentPage).toBe(2);
    });

    it('should emmit event when page changes', () => {
        comp.totalPages = 5;
        fixture.detectChanges();
        let currentPage = 100;
        fixture.componentInstance.onPageChanged.subscribe(page => currentPage = page);
        let page = new QuestionPagerComponentPage(fixture.debugElement);
        page.next();
        expect(currentPage).toBe(2);
    });
});