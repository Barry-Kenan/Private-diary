import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { FileMetaData } from '../models/file-meta-data';
import { Note } from '../models/note';

/**
 * сервис для работы с данными
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * массив с названием изображений
   */
  public imagesName: Array<string>;

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage) {}

  /**
   * загрузка записи
   * @param fileObj изображение
   * @param text текст
   */
  public saveNote(fileObj: FileMetaData, text: string): void {
    const note = {
      id: '',
      createdDate: new Date(),
      text,
      name: fileObj.name,
      url: fileObj.url,
    };
    note.id = this.fireStore.createId();
    this.fireStore.collection('/Notes').add(note);
  }

  /**
   * получение всех записей
   * @returns observable
   */
  public getAllNotes(): Observable<DocumentChangeAction<unknown>[]> {
    return this.fireStore.collection('/Notes').snapshotChanges();
  }

  /**
   * получение записи
   * @param id id  записи
   * @returns observable
   */
  public getNote(id: string): any {
    return this.fireStore.collection('/Notes').doc(id).get();
  }

  /**
   * обновление текста записи
   * @param id id  записи
   * @param text текст
   * @returns observable
   */
  public updateNote(id: string, text: string): Promise<void> {
    const data = {
      createdDate: new Date(),
      text,
    };

    return this.fireStore.collection('Notes').doc(id).update(data);
  }

  /**
   * удаление записи
   * @param note запись
   */
  public deleteNote(note: Note): void {
    this.getAllNotes().subscribe(res => {
      this.imagesName = res.map((e: any) => {
        const data = e.payload.doc.data();

        return data.name;
      });
    });

    const imagesCount = this.imagesName.filter(e => e === note.name).length;
    this.fireStore.collection('/Notes').doc(note.id).delete();
    if (imagesCount === 1) {
      this.fireStorage.ref(`/Notes/${note.name}`).delete();
    }
  }
}
