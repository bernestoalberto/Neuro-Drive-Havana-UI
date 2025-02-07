import { Component,Input ,Output, EventEmitter, inject, effect, signal } from '@angular/core';

import { AppService } from '../app.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';


import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AI, AI_NAME } from './helper';

@Component({
  selector: 'app-prompt-input',

  imports: [FormsModule, HttpClientModule, MatButtonModule, MatIconModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule],
  templateUrl: './prompt-input.component.html',
  styleUrl: './prompt-input.component.sass',
})
export class PromptInputComponent {
  prompt: string = '';
  chatHistory = signal<string[] | any>([]);
  surpriseOptions = [
    'Who won the latest Novel Peace Prize?',
    'Where does pizza come from?',
    'Who do you make a BLT sandwich with?',
    'What is the oldest town in America?',
    'Who wrote Hotel California?'
  ];
  private readonly appService: AppService = inject(AppService);
  readonly messages = this.appService.messages;
  readonly generatingInProgress = this.appService.generatingInProgress;
  clearStatus = true;
  @Input() errorMessage = '';
  @Input() showSpinner = false;

  @Output() errorMessageEvent = new EventEmitter<String>();
  @Output() showSpinnerEvent = new EventEmitter<{status: boolean}>();
  @Output() chatHistoryEvent = new EventEmitter<any[]>();

  constructor() {
    effect(() => {
      console.log(this.chatHistory());
    });
  }


  clear() {
    this.clearStatus = false;
    this.prompt = '';
    this.sendError();
    this.chatHistory.set([]);
  }
  sendError(error: string = ''){
    this.errorMessageEvent.emit(error);
  }
  setShowSpinner(value = true) {
    this.showSpinnerEvent.emit({status: value});
  }
  sendChatHistory(){
    this.chatHistoryEvent.emit(this.chatHistory());
  }
  getResponseFromAI(aiToUse: AI) {
    if (!this.prompt) {
      this.sendError('Please enter a question');
      return;
    }
    try {
      this.setShowSpinner();
      this.appService.getResponse(this.chatHistory(), this.prompt, aiToUse).subscribe(data => {
        this.clearStatus =  false;
        this.chatHistory.set({
          role: 'user',
          parts: this.prompt
        });
        this.chatHistory.set({
          role: 'model',
          parts: data['parts']
        });
      this.setShowSpinner(false);
      this.sendChatHistory();
      });
    } catch (error: any) {
      console.error(error);
      this.sendError(error.message);
      this.setShowSpinner(false);
    }
  }

  surprise() {
    this.clearStatus = true;
    const randomValue = Math.floor(Math.random() * this.surpriseOptions.length);
    this.prompt = this.surpriseOptions[randomValue];
  }
  private readonly scrollOnMessageChanges = effect(() => {
    // run this effect on every messages change
    this.messages();

    // scroll after the messages render
    setTimeout(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      }),
    );
  });

  sendMessage(form: NgForm, messageText: string): void {
    this.appService.sendMessage(messageText);
    form.resetForm();
  }
}
