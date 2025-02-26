import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AppService } from '../app.service';
import { Answer } from '../shared/helper';

@Injectable({ providedIn: 'root' })
export class PromptResolverService implements Resolve<Answer[]> {
  constructor(
    private appService: AppService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const answers = this.appService.();

    if (answers.length === 0) {
      return this.appService.fetchRecipes();
    } else {
      return answers;
    }
  }
}
