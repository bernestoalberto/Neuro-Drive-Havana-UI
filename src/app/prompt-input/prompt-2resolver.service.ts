import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AppService } from '../app.service.ts';
import { Answer } from '../shared/helper.ts';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromptResolverService implements Resolve<Answer[]> {
  constructor(
    private appService: AppService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Answer[]> {
    const answers = this.appService.getAnswers();

    if (answers.length === 0) {
      return this.appService.fetchAnswers();
    } else {
      return of(answers);
    }
  }
}
