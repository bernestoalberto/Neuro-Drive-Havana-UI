import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { HttpEventType } from '@angular/common/http';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-image-upload',

  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.sass'
})
export class ImageUploadComponent implements OnInit{
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;
  selectedFile: File =  {} as File ;
  fileData: string = '';
  previewUrl: string | ArrayBuffer | null = '';
  uploadProgress = 0;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  progressValue = 50;
  bufferValue = 75;

 constructor(private appService: AppService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // const reader = new FileReader();
    // reader.readAsDataURL(this.selectedFile);
    // reader.onload = () => {
    //   this.previewUrl = reader.result as string;
    // };
  }

  removeImage(event : any) {
    this.selectedFile = new File(['content'], 'filename.png');
    this.previewUrl = '';
  }

  onSubmitUpload(event: any): void {
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.selectedFile);
    reader.onload = () => {
      if(reader.result){
      const blob = new Blob([reader.result], { type: this.selectedFile.type });
      this.uploadImage(blob);
      }
    };
  }


  uploadImage(blob:Blob) {
    if(this.selectedFile.size > 0){
    const formData = new FormData();
    formData.append('file', blob, this.selectedFile.name);
    this.appService.uploadImage(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressValue = Math.round(100 * event.loaded /
        // event.total);
        50);
      } else if (event.type === HttpEventType.Response) {
        console.log('Image uploaded successfully!');
        // Handle successful upload response here
      }
    });
    return;
    }
  }

}
