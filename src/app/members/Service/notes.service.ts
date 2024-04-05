import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "../../core/Services/appwrite.service";
import {ID} from "appwrite";
import {from} from "rxjs";
import {Note} from "../../core/common/note";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notesDatabaseId = '660fdd809255d656dc2f';

  appwrite = inject(AppwriteService);

  addNote(collectionId: string, note: Note) {
    return from(this.appwrite.databases.createDocument(
      this.notesDatabaseId,
      collectionId,
      ID.unique(),
      note
    ))
  }

  constructor() { }
}
