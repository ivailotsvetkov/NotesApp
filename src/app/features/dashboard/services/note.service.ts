import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';

@Injectable()
export class NoteService {
  private dbPath = '/note';

  notesRef: AngularFireList<Note>; // Reference to note data list, its an Observable
  noteRef: AngularFireObject<Note>;

  constructor(private db: AngularFireDatabase) {
    this.notesRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Note> {
    return this.notesRef;
  }

  getData(key: string): AngularFireObject<Note> {
    this.noteRef = this.db.object('note/' + key);
    return this.noteRef;
  }

  create(note: Note): any {
    return this.notesRef.push(note);
  }

  update(key: string, value: any): Promise<void> {
    return this.notesRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.notesRef.remove(key);
  }
}
