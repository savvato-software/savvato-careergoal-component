import { Injectable } from '@angular/core';

import { ApiService } from 'savvato-javascript-services'
import { FunctionPromiseService } from 'savvato-javascript-services'

@Injectable({
	providedIn: 'root'
})
export class ModelService {

	LABOUR_CONTAINS_FILTERED_QUESTIONS = "lcfq";
	NO_FILTER = "noFilter"
	GET_ASKED_QUESTIONS = "getAskedQuestions";
	GET_CORRECTLY_ANSWERED_QUESTIONS = "getAllCorrectlyAnsweredQuestions";
	GET_INCORRECTLY_ANSWERED_QUESTIONS = "getAllIncorrectlyAnsweredQuestions";

	constructor(private _apiService: ApiService,
				private _functionPromiseService: FunctionPromiseService) {

	}

	_init(environment) {
		let self = this;

		this._functionPromiseService.reset(this.GET_CORRECTLY_ANSWERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_CORRECTLY_ANSWERED_QUESTIONS, (data) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/correctlyAnsweredQuestions";
				this._apiService.get(url)
				.subscribe((rtn) => {
					resolve(rtn);
				}, (err) => {
					reject(err);
				})
			})
		});

		this._functionPromiseService.reset(this.GET_INCORRECTLY_ANSWERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_INCORRECTLY_ANSWERED_QUESTIONS, (data) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/incorrectlyAnsweredQuestions";
				this._apiService.get(url)
				.subscribe((rtn) => {
					resolve(rtn);
				}, (err) => {
					reject(err);
				})
			})
		});

		this._functionPromiseService.reset(this.GET_ASKED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_ASKED_QUESTIONS, (data) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/askedQuestions";
				this._apiService.get(url)
				.subscribe((rtn) => {
					resolve(rtn);
				}, (err) => {
					reject(err);
				})
			})
		});

		this._functionPromiseService.reset(this.LABOUR_CONTAINS_FILTERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.LABOUR_CONTAINS_FILTERED_QUESTIONS, (data) => {
			return new Promise((resolve, reject) => {
				let flq = data['flq'];

				resolve(data['labour']['questions'].map(
			        (q) => {
			          flq.map((q) => q['id']).includes(q['id']);
			        }).length > 0)
			})
		});
	}

	answerQualityFilter = this.GET_ASKED_QUESTIONS;
	getQuestionCountFuncName(filter) {
		let funcName = undefined;
		let self = this;

		if (filter == "correct") {
			funcName = self.GET_CORRECTLY_ANSWERED_QUESTIONS;
		} else if (filter == "incorrect") {
			funcName = self.GET_INCORRECTLY_ANSWERED_QUESTIONS;
		} else {
			funcName = self.GET_ASKED_QUESTIONS;
		}

		return funcName;
	}

	getAnswerQualityFilter() {
		return this.answerQualityFilter;
	}

	setAnswerQualityFilter(filter) {
		this._functionPromiseService.reset(this.getQuestionCountFuncName(this.answerQualityFilter));
		this.answerQualityFilter = filter;
	}

	getAskedQuestions(userId) {
		return this._functionPromiseService.waitAndGet(this.GET_ASKED_QUESTIONS, this.GET_ASKED_QUESTIONS, {userId: userId});
	}

	getFilteredListOfQuestions(userId) {
		return this._functionPromiseService.waitAndGet(this.answerQualityFilter, this.answerQualityFilter, {'userId': userId});
	}

	labourContainsFilteredQuestion(userId, labour) {
		if (this.answerQualityFilter === this.NO_FILTER)
			return true;

		let flq = this._functionPromiseService.get(this.answerQualityFilter, this.answerQualityFilter, {userId: userId});

		if (flq) 
			return this._functionPromiseService.get(this.LABOUR_CONTAINS_FILTERED_QUESTIONS+labour['id'], this.LABOUR_CONTAINS_FILTERED_QUESTIONS, {userId: userId, labour: labour, flq: flq});

		return true;
	}

	milestoneContainsFilteredQuestion(userId, milestone) {
		let self = this;
		return milestone['labours'].map((l) => {
			self.labourContainsFilteredQuestion(userId, l);
		}).length > 0;
	}

	pathContainsFilteredQuestion(userId, path) {
		let self = this;
		return path['milestones'].map((m) => {
			self.milestoneContainsFilteredQuestion(userId, m);
		}).length > 0;
	}

	careerGoalContainsFilteredQuestion(userId, cg) {
		let self = this;
		return cg['paths'].map((p) => {
			self.careerGoalContainsFilteredQuestion(userId, p);
		}).length > 0;
	}
}
