import { Component, inject, effect, signal, WritableSignal, OnInit } from '@angular/core';

import { AppService } from '../app.service';
import {MatButtonModule} from '@angular/material/button';


import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ModelGroup, AiProvider, AI_NAME } from './helper';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from "../search-result/search-result.component";
import { ErrorResultComponent } from "../error-result/error-result.component";
import { LoadingSpinnerComponent } from "../shared/loading-spinner/loading-spinner.component";
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
// import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-prompt-input',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, CommonModule, SearchResultComponent, ErrorResultComponent, LoadingSpinnerComponent, MatSelectModule, ReactiveFormsModule, MatTooltipModule, MatGridListModule],
  templateUrl: './prompt-input.component.html',
  styleUrl: './prompt-input.component.scss',
})
export class PromptInputComponent implements OnInit {
  prompt: string = '';
  chatHistory = signal<string[] | any>([]);
  readonly dialog = inject(MatDialog);
  surpriseOptions = [
    'Who won the latest Novel Peace Prize?',
    'What is the best Science Fiction movie in 2022 ai ?',
    'Where does pizza come from?',
    'Who do you make a BLT sandwich with?',
    'What is the oldest town in America?',
    'Who wrote Hotel California?'
  ];
  error = '';
  showSpinner: WritableSignal<boolean> = signal(false);
  private readonly appService: AppService = inject(AppService);
  messages = this.appService.messages;
  readonly generatingInProgress = this.appService.generatingInProgress;
  clearStatus: WritableSignal<boolean> = signal(false);
  errorMessage = '';
  form = new FormGroup({
    model: new FormControl({value: '', disabled: false}, [Validators.required]),
    aiProvider: new FormControl('', [Validators.required]),
    prompt: new FormControl('', [Validators.required])
  });
  aiProviderControl = 'aiProvider';
  modelControl = 'model';
  promptControl = 'prompt';

  geminiModelGroup: ModelGroup =
    {
      name: AI_NAME.GEMINI,
      disabled: false,
      model: [
        {
          value: 'gemini-2.0-flash-lite-preview',
          viewValue: `${AI_NAME.GEMINI} 2.0 Flash Lite Preview`
      },
       {
          value: 'gemini-2.0-pro-expreimental',
          viewValue: `${AI_NAME.GEMINI} 2.0 Pro Expreimental`
      },
       {
          value: 'gemini-2.0-flash',
          viewValue: `${AI_NAME.GEMINI} 2.0 Flash`
      },
      {
        value: 'gemini-1.5-flash',
        viewValue: `${AI_NAME.GEMINI} 1.5 flash`
      },
      ],
    };
  openAIModelGroup: ModelGroup =

    {
      name: AI_NAME.OPENAI ,
      disabled: false,
      model: [
        {value: 'gpt-3.5-turbo', viewValue: 'GPT 3.5 Turbo'},
        {value: 'gpt-4o', viewValue: 'GPT 4o'},
        {value: 'gpt-4o-mini', viewValue: 'GPT 4o Mini'},
      ],
    };
  deepSeekModelGroup: ModelGroup =
    {
      name: AI_NAME.DEEPSEEK,
      disabled: false,
      model: [
        {value: 'deepseek-r1:1.5b', viewValue: `${AI_NAME.DEEPSEEK} R1:1.5b`}
      ],
  }
  llamaModelGroup: ModelGroup =
    {
      name: AI_NAME.LLAMA,
      disabled: false,
      model: [
        {value: 'llama-3.2-3b-instruct', viewValue: `Llama-3.2`}
      ],
  }
  currentodel: ModelGroup[] = [];
  aiProviders: AiProvider[] = [
    {
      name: AI_NAME.GEMINI,
      id: AI_NAME.GEMINI.toLowerCase()
    },
    {
      name: AI_NAME.OPENAI,
      id: AI_NAME.OPENAI.toLowerCase()
    },
    {
      name: AI_NAME.DEEPSEEK,
      id:AI_NAME.DEEPSEEK.toLowerCase()
    },
    {
      name: AI_NAME.LLAMA,
      id:AI_NAME.LLAMA.toLowerCase()
    }
  ];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

   ngOnInit() {
    this.form.controls.model.valueChanges.subscribe((value) => {
      if(this.form.value.aiProvider === AI_NAME.OPENAI){
         this.dialog.open(DialogComponent, {
          data: {
            title : 'Open AI model selected' ,
            content: `This model ${value} is not free , please use it with responsability.`}
           }
           );
      }
    });
    this.form.controls.aiProvider.valueChanges.subscribe((value) => {
      let group = this.geminiModelGroup;
      this.currentodel = [];
      this.setShowSpinner(false);
      if(value === AI_NAME.OPENAI) {
        group = this.openAIModelGroup;
      } else if(value === AI_NAME.DEEPSEEK) {
        group = this.deepSeekModelGroup;
      } else if(value === AI_NAME.LLAMA) {
        group = this.llamaModelGroup;
      }
      this.currentodel = [...[], group];
    });
   }

  constructor() {}


  onFormSubmit(){
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.getResponseFromAI();
    } else {
      this.appService.openSnackBar();
      this.sendError('Please fill all required fields');
    }
  }

  clear() {
    this.clearStatus.set(false);
    this.prompt = '';
    this.sendError();
    this.showSpinner.set(false);
    this.chatHistory.set([]);
  }
  sendError(error: string = ''){
    this.errorMessage = error;
  }
  setShowSpinner(value = true) {
    this.showSpinner.set(value);
  }
  // sendChatHistory(){
  //   this.chatHistoryEvent.emit(this.chatHistory());
  // }
  getResponseFromAI() {
    try {
      const {aiProvider, prompt, model } = this.form.value;
      this.setShowSpinner();
      this.appService.getResponse(this.chatHistory(), `${prompt}`,`${aiProvider}`, `${model}`).subscribe((data) => {
        this.clearStatus.set(false);
        this.chatHistory.update(history => {
          return [...history, {
          role: 'user',

          parts: this.prompt
        }
      ]
     }
      );
        this.chatHistory.update(history => {
            return [...history, {
          role: 'model',
          parts: data['result']
        }]});
      this.setShowSpinner(false);
      });
    } catch (error: any) {
      this.sendError(error.message);
      this.setShowSpinner(false);
    }
  }

  surprise() {
    this.clearStatus.set(true);
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
  get isPromptFieldEmpty(): boolean {
    return this.form.value.prompt?.length === 0;
  }


  sendMessage(form: NgForm, messageText: string): void {
    this.appService.sendMessage(messageText);
    form.resetForm();
  }
  clearSearch(){
    this.prompt = '';
    (this.form as FormGroup).controls[this.promptControl].setValue('');
  }
  get isModelFieldEmpty(): boolean {
    return this.form.value.model?.length === 0;
  }
}
