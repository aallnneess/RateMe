import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Rate} from "../../../core/common/rate";
import {Note} from "../../../core/common/note";
import {NotesService} from "../../Service/notes.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/Services/auth.service";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent implements OnInit {

  @ViewChild('sendButton') sendButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('textarea') textArea!: ElementRef<HTMLTextAreaElement>;

  addForm!: FormGroup;

  notesService = inject(NotesService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  @Input() rate!: Rate;
  notes: Note[] = [];

  ngOnInit(): void {
    this.notesService.getNotes(this.rate.notesCollectionId).subscribe(result => {
      this.notes = result;
    });

    this.addForm = this.formBuilder.group({
      addNote: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]]
    });
  }


  submitForm() {
    if (this.addForm.valid) {

      console.log('action');

      const note = new Note(
        this.addForm.get('addNote')?.value,
        this.authService.user()!.name,
        this.authService.user()!.$id
      );

      this.notesService.addNote(this.rate.notesCollectionId,note).subscribe(() => {
        this.clear();
        this.notesService.getNotes(this.rate.notesCollectionId).subscribe(result => {
          this.notes = result;
        });
      });

    }
  }

  formatDatetime(time: number) {
    const now = new Date();
    const postDate = new Date(time);

    const timeDifference = now.getTime() - postDate.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const yearsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

    if (yearsDifference > 1) {
      return `${yearsDifference} Jahre`;
    } else if (daysDifference > 1) {
      return `${daysDifference} Tage`;
    } else if (hoursDifference > 1) {
      return `${hoursDifference} Stunden`;
    } else if (minutesDifference > 60) {
      return `${Math.floor(minutesDifference / 60)} Stunden`;
    } else {
      return `${minutesDifference} Minuten`;
    }
  }



  clear() {
    this.textArea.nativeElement.value = '';
  }


}
