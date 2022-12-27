import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { FileMetaData } from 'src/app/models/file-meta-data';
import { DataService } from 'src/app/services/data.service';
import { Note } from '../../models/note';

/**
 * компонент для изменения записи
 */
@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
})
export class EditNoteComponent implements OnInit {
  /**
   * процент загрузки изображения
   */
  public percentage: number;

  /**
   * текст записи
   */
  public text: string;

  /**
   * исходные данные записи
   */
  public initialData: Note;

  /**
   * форма для изменения записи
   */
  public editForm: FormGroup;

  /**
   * id изменяемой записи
   */
  private id: string;

  /**
   * выбранное изображение
   */
  private selectedFiles: FileList;

  /**
   * изображение для загрузки
   */
  private currentFileUpload: FileMetaData;

  constructor(
    private dataService: DataService,
    private fireStorage: AngularFireStorage,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.percentage = 0;
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.editForm = this.fb.group({
      text: [''],
      file: [''],
    });

    this.initialData = {
      id: '',
      createdDate: new Date(),
      name: '',
      text: '',
      url: '#',
    };
  }

  public ngOnInit(): void {
    this.dataService.getNote(this.id).subscribe(res => {
      this.initialData = res.data();
      this.initialData.id = this.id;
      this.editForm.patchValue({ text: this.initialData.text });
    });
  }

  /**
   * для доступа к формконтролам
   * @returns form controls
   */
  public get f(): any {
    return this.editForm.controls;
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
    if (!this.editForm.get('file').value) {
      this.uploadText();
    } else {
      this.uploadFiles();
    }
  }

  /**
   * метод для загрузки изображения и текста
   */
  private uploadFiles(): void {
    this.dataService.deleteNote(this.initialData);

    this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
    this.text = this.editForm.get('text').value;

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
              this.toast.info('Запись изменена');
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        err => {
          this.toast.error(err);
        }
      );
  }

  /**
   * метод для обновления текста
   */
  private uploadText(): void {
    const text = this.editForm.get('text').value;
    this.dataService.updateNote(this.id, text);
    this.toast.info('Текст записи изменен');
    this.router.navigate(['/home']);
  }
}
