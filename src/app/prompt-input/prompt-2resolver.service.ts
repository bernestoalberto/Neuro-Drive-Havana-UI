import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AppService } from '../app.service';
import { Answer } from '../shared/helper';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromptResolverService implements Resolve<Answer[]> {
  constructor(private appService: AppService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const answers = this.appService.getAnswers() as Answer[];

    if (answers.length === 0) {
      return this.appService.fetchAnswers() as any as Answer[];
    } else {
      return of(answers as Answer[]);
    }
  }
}
