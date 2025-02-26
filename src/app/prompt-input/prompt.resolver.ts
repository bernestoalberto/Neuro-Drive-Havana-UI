import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AppService } from '../app.service';

export const promptResolver: ResolveFn<boolean> = (route, state) => {
  const appService = inject(AppService);
  const answers = appService.getAnswers();

  if (answers.length > 0) {
    return true;
  } else {
    return false;
  }
};
