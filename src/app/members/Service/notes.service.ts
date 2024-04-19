import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "../../core/Services/appwrite.service";
import {ID, Query} from "appwrite";
import {from, map, tap} from "rxjs";
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

  getNotes(collectionId: string) {
    return from(this.appwrite.databases.listDocuments(
      this.notesDatabaseId,
      collectionId,
      [
        Query.orderDesc(''),
        Query.limit(1000)
      ]
    )).pipe(
      map(response => response.documents as unknown as Note[])
      // tap(notes => console.log('Get notes length: ' + notes.length))
    );
  }

  constructor() { }
}
