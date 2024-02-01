import {Component, inject, OnInit} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  dataStore: DataStoreService = inject(DataStoreService);

  ngOnInit(): void {
    this.dataStore.updateBooks();
  }

  click() {
    console.log('klick');
  }
}
