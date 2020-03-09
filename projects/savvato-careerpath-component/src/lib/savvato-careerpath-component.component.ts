import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CareerGoalService } from 'savvato-javascript-services'
import { UserService } from './_services/user.service'

@Component({
  selector: 'lib-savvato-careerpath-component',
  templateUrl: './savvato-careerpath-component.html',
  styleUrls: ['./savvato-careerpath-component.component.scss']
})
export class SavvatoCareerpathComponentComponent implements OnInit {

  @Input() ctrl;

  getCareerGoalProviderFunction = undefined;
  careerGoal = undefined;
  careerGoalId = undefined;
  user = undefined;
  userId = undefined;

  funcKey = "careerpath-controller1Xr7";

  constructor(//private _location: Location,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
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

        self.user = ctrl.getUser();
        self.userId = self.user['id'];

        self.getCareerGoalProviderFunction = ctrl.getCareerGoalProviderFunction;
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
      return labour['questions'];
    } else {
      return [ ];
    }
  }

  LEVEL_LABOURS = 4
  getLaboursFromMilestone(milestone) {
    if (milestone && this.myLevelIsShowing(this.LEVEL_LABOURS)) {
      return milestone['labours'];
    } else {
      return [ ];
    }
  }

  LEVEL_MILESTONE = 3
  getMilestonesFromPath(path) {
    if (path && this.myLevelIsShowing(this.LEVEL_MILESTONE)) {
      return path['milestones'];
    } else {
      return [ ];
    }
  }

  LEVEL_PATHS = 2
  getCareerGoalPaths(cg) {
    if (cg && this.myLevelIsShowing(this.LEVEL_PATHS)) {
      return cg['paths']
    } else {
      return [ ];
    }
  }

  LEVEL_CAREER_GOAL = 1
  getCareerGoal() {
    if (this.myLevelIsShowing(this.LEVEL_CAREER_GOAL)) {
      return [this.careerGoal];
    } else {
      return [ ];
    }
  }
  
  selectedCollapseToLevel = this.LEVEL_LABOURS;
  myLevelIsShowing(myLevel) {
    return this.selectedCollapseToLevel * 1.0 >= myLevel;
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
