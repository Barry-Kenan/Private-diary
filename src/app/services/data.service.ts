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
    this.fireStore.collection('/Notes').doc(note.id).delete();
    this.fireStorage.ref(`/Notes/${note.name}`).delete();
  }
}
