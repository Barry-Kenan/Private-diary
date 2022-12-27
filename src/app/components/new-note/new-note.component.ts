import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FileMetaData } from '../../models/file-meta-data';

/**
 * компонент для новых записей
 */
@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss'],
})
export class NewNoteComponent {
  /**
   * процент загрузки изображения
   */
  public percentage: number;

  /**
   * форма для добавления записи
   */
  public noteForm: FormGroup;

  /**
   * выбранное изображение
   */
  private selectedFiles: FileList;

  /**
   * изображение для загрузки
   */
  private currentFileUpload: FileMetaData;

  /**
   * текст записи
   */
  private text: string;

  constructor(
    private dataService: DataService,
    private fireStorage: AngularFireStorage,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {
    this.percentage = 0;
    this.noteForm = this.fb.group({
      text: [''],
      file: ['', [Validators.required]],
    });
  }

  /**
   * для доступа к формконтролам
   * @returns form controls
   */
  public get f(): any {
    return this.noteForm.controls;
  }

  /**
   * Очистка формы
   */
  public reset(): void {
    this.noteForm.reset();
  }

  /**
   * для присвоения изображения
   * @param event event
   */
  public selectFile(event): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files;
    }
  }

  /**
   * отправка формы
   */
  public submit(): void {
    this.uploadFiles();
  }

  /**
   * метод для загрузки изображения и текста
   */
  private uploadFiles(): void {
    this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
    this.text = this.noteForm.get('text').value;

    const path = `Notes/${this.currentFileUpload.file.name}`;

    const storageRef = this.fireStorage.ref(path);
    const uploadTask = storageRef.put(this.selectedFiles[0]);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadLink => {
            this.currentFileUpload.id = '';
            this.currentFileUpload.url = downloadLink;
            this.currentFileUpload.name = this.currentFileUpload.file.name;

            this.dataService.saveNote(this.currentFileUpload, this.text);
          });
        })
      )
      .subscribe(
        (res: any) => {
          this.percentage = (res.bytesTransferred * 100) / res.totalBytes;
          if (this.percentage === 100) {
            setTimeout(() => {
              this.toast.info('Новая запись добавлена');
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        err => {
          this.toast.error(err);
        }
      );
  }
}
