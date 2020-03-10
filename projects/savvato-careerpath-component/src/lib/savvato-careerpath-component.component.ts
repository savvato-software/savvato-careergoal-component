import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CareerGoalService } from 'savvato-javascript-services'
import { FunctionPromiseService } from 'savvato-javascript-services'
import { UserService } from './_services/user.service'
import { ModelService } from './_services/model.service'

@Component({
  selector: 'lib-savvato-careerpath-component',
  templateUrl: './savvato-careerpath-component.html',
  styleUrls: ['./savvato-careerpath-component.component.scss']
})
export class SavvatoCareerpathComponentComponent implements OnInit {

  @Input() ctrl;

  answerQualityFilter = undefined;
  hideAnswerQualityFilters = false;
  getCareerGoalProviderFunction = undefined;
  careerGoal = undefined;
  careerGoalId = undefined;
  user = undefined;
  userId = undefined;

  funcKey = "careerpath-controller1Xr7";

  constructor(private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _modelService: ModelService,
        private _functionPromiseService: FunctionPromiseService,
        private _careerGoalService: CareerGoalService) {

  }

  environment = undefined;
  getEnvironment() {
    return this.environment;
  }

  ngOnInit() {
    let self = this;

    self.ctrl.then((ctrl) => {
        self.environment = ctrl.getEnv();
        self._modelService._init(ctrl.getEnv());

        self.user = ctrl.getUser();
        self.userId = self.user['id'];

        self.getCareerGoalProviderFunction = ctrl.getCareerGoalProviderFunction;

        self._modelService.getAskedQuestions(self.userId).then((askedQuestions: [{}]) => {
          console.log("AQ: AQ: askedQuestions", askedQuestions);
          if (!askedQuestions.length) {
            self._modelService.setAnswerQualityFilter(self._modelService.NO_FILTER);
            self.hideAnswerQualityFilters = true;
          }
        })

        self._functionPromiseService.initFunc("getQuestionsFromLabourFunc", (data) => {
          return new Promise((resolve, reject) => {
            if (self._modelService.getAnswerQualityFilter() === self._modelService.NO_FILTER) {
              console.log("@@@ gqflf had no filter set, returning the full data labors questions set", data['labour']['questions'])
              resolve(data['labour']['questions']);
            }

            self._modelService.getFilteredListOfQuestions(self.userId).then((flq: [{}]) => {
              console.log("@@@ data ", data)

              if (data['labour']) {
                
                console.log("@@@@ flq", flq)
                console.log("@@@@ dataLaborQuestions", data['labour']['questions'])

                let res = data['labour']['questions'].filter(
                  (q) => {
                    return flq.map((q1) => q1['id']).includes(q['id']);
                  })

                console.log("@@@@ res ", res)

                resolve(res)
              } else {
                  reject();
              }
            })
          })
        })
      })
  }

  getCareerGoalName() {
    if (this.getCareerGoalProviderFunction) {
      let cg = this.getCareerGoalProviderFunction();

      if (cg) {
        return cg['name'];
      }
    } 

    return undefined;
  }

  LEVEL_QUESTION = 5
  getQuestionsFromLabour(labour){
    if (labour && this.myLevelIsShowing(this.LEVEL_QUESTION)) {
      console.log("-=-=-=-=-=-=+++++-=-=+++=DDD")
      return this._functionPromiseService.get("getQuestionsFromLabourFunc"+labour['id'], "getQuestionsFromLabourFunc", {labour: labour});
    } else {
      return [ ];
    }
  }

  LEVEL_LABOURS = 4
  getLaboursFromMilestone(milestone) {
    let self = this;
    if (milestone && this.myLevelIsShowing(this.LEVEL_LABOURS)) {
      return milestone['labours'].filter((l) => self._modelService.labourContainsFilteredQuestion(self.userId, l));
    } else {
      return [ ];
    }
  }

  LEVEL_MILESTONE = 3
  getMilestonesFromPath(path) {
    let self = this;
    if (path && this.myLevelIsShowing(this.LEVEL_MILESTONE)) {
      return path['milestones'].filter((m) => self._modelService.milestoneContainsFilteredQuestion(self.userId, m));
    } else {
      return [ ];
    }
  }

  LEVEL_PATHS = 2
  getCareerGoalPaths(cg) {
    let self = this;
    if (cg && this.myLevelIsShowing(this.LEVEL_PATHS)) {
      let rtn = cg['paths'].filter((p) => self._modelService.pathContainsFilteredQuestion(self.userId, p));

      // console.log("getCareerGoalPaths rtn ", rtn)
      return rtn;
    } else {
      // console.log("getCareerGoalPaths RETURNING EMPTY ")
      return [ ];
    }
  }

  LEVEL_CAREER_GOAL = 1
  getCareerGoal() {
    if (this.getCareerGoalProviderFunction && this.myLevelIsShowing(this.LEVEL_CAREER_GOAL)) {
      let cg = this.getCareerGoalProviderFunction();
      // console.log("getCareerGoalProviderFunction returned ", cg)
      return [cg];
    } else {
      // console.log("no careerGoalProvider function!! returning ", []);
      return [ ];
    }
  }

  selectedCollapseToLevel = this.LEVEL_LABOURS;
  myLevelIsShowing(myLevel) {
    return this.selectedCollapseToLevel * 1.0 >= myLevel;
  }

  getSelectedCollapseToLevel() {
    console.log("@@@ getSelectedCollapseToLevel rtn ", this.selectedCollapseToLevel)
    return this.selectedCollapseToLevel;
  }

  collapseLevelTitles = {1: 'Career Goal', 2: 'Path', 3: 'Milestone', 4: 'Labour', 5: 'Full Detail'};
  getSelectedCollapseToLevelText() {
    return this.collapseLevelTitles[this.selectedCollapseToLevel * 1];
  }

  onFocus(evt) {
    this._modelService.setAnswerQualityFilter(evt.target.value);
  }

  onBlur(evt) {

  }

  /*
  Provide user-defined handlers for these

  onPathNameClick(path) {
    this._router.navigate(['/paths/display/' + path['id']]);
  }

  onMilestoneNameClick(milestone) {
    this._router.navigate(['/milestones/display/' + milestone['id']]);
  }

  onLabourNameClick(labour) {
    this._router.navigate(['/labours/display/' + labour['id']]);
  }

  onEditCareerGoalBtnClick() {
    this._router.navigate(['/career-goals/edit/' + this.careerGoalId]);
  }
  */
}
