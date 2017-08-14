import {Injectable} from '@angular/core';
import {questionTypes} from "../../data/question.data";

@Injectable()
export class StatisticsService {

    constructor() {}

    getQuestionsStatistics(questions: Array<any>) {
        let filteredQuestions = this.removeQuestionsWithoutStatistics(questions);
        let statistics = filteredQuestions.map(this.calculateQuestionStatistics);
        return statistics;
    }

    private removeQuestionsWithoutStatistics(questions: Array<any>) {
        return questions.filter(question =>
            [questionTypes.choose_one, questionTypes.choose_multiple].includes(question.type)
        )
    }

    private calculateQuestionStatistics = (question: any)=> {
        let numberOfAnswers = question.answers.length;
        let questionStatistics = this.initQuestionStatistics(question);

        this.countAnswers(question, questionStatistics);
        this.calculateAnswerPercentage(questionStatistics, numberOfAnswers);

        return {
            text: question.text,
            answers: questionStatistics
        };
    };

    private initQuestionStatistics(question) {
        let initialAnswerStatistics = question.answerLabels.map(answerLabel => {
            return {
                text: answerLabel,
                checked: 0
            }
        });

        if('otherAnswer' in question) {
            initialAnswerStatistics.push({
                text: question.otherAnswer,
                checked: 0
            })
        }

        return initialAnswerStatistics;
    }

    private countAnswers(question: any, questionStatistics: any) {
        switch (question.type){
            case questionTypes.choose_one:
                this.countSingleChoiceAnswers(question.answers, questionStatistics);
                break;
            case questionTypes.choose_multiple:
                this.countMultipleChoiceAnswers(question.answers, questionStatistics);
                break;
        }
    }

    private countSingleChoiceAnswers(answers: any, questionStatistics: any) {
        answers.forEach(answer => {
            let answerIndex = answer.answers != 'other' ? answer.answers : questionStatistics.length-1;
            questionStatistics[answerIndex].checked++;
        });
    }

    private countMultipleChoiceAnswers(answers: any, questionStatistics: any) {
        answers.forEach(answer => {
            answer.answers.forEach(answerIndex => questionStatistics[answerIndex].checked++);
            if ('userAnswer' in answer) {
                let otherAnswerIndex = questionStatistics.length-1;
                questionStatistics[otherAnswerIndex].checked++
            }
        });
    }

    private calculateAnswerPercentage(questionStatistics, numberOfAnswers) {
        questionStatistics.map(answer => answer.percentage = (answer.checked/numberOfAnswers)*100);
    }

}
