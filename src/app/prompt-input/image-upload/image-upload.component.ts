import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppService } from '../../app.service';
import { HttpEventType } from '@angular/common/http';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-image-upload',

  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CdkDrag,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;
  selectedFile: File | null = null;
  anotherSelected: File | null = null;
  fileData: string = '';
  previewUrl: string | ArrayBuffer | null = '';
  uploadProgress = 0;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  progressValue = 50;
  bufferValue = 75;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  private appService = inject(AppService);

  constructor() {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const currentElement = event.target as HTMLInputElement;
    if (currentElement.files && currentElement.files.length > 0) {
      this.selectedFile = currentElement.files[0];
      this.fileSize = `${(this.selectedFile.size / 1024).toFixed(2)} KB`;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  removeImage() {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.previewUrl = '';
  }

  onSubmitUpload(): void {
    if (!this.selectedFile) {
      this.appService.openSnackBar('No file selected!');
      return;
    }
    this.uploadImage();
  }

  uploadImage() {
    if (this.selectedFile && this.selectedFile.size > 0) {
      const formData = new FormData();
      formData.append('thumbnail', this.selectedFile, this.selectedFile.name);

      // Log to verify FormData content
      console.log('FormData content:', formData.get('image'));

      this.appService.uploadImage(formData).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === HttpEventType.Response) {
            this.appService.openSnackBar('Upload successful');
            this.removeImage(); // Clear the form after successful upload
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.appService.openSnackBar('Upload failed');
        },
      });
      return;
    }
    this.appService.openSnackBar('Please select a valid file');
    return;
  }
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    // Fix this
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }
}
