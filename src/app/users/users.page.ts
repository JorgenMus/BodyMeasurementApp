import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel } from '@ionic/angular/standalone';

import {Router} from '@angular/router';
import { StoreService, UserData } from '../services/store.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UsersPage implements OnInit {

  // TODO decide if storing users here is a good idea

  constructor(private router: Router, private store: StoreService) { }

  ngOnInit() {
    // attempt to refresh page when displayed
    await this.store.loadUsers();
    this.users = 
  }

  createNewUser()
  {
    this.router.navigate(['/tabs/user-create']);
  }

}
