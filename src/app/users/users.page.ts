import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonButtons, IonButton, IonList, IonItem, IonNote, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import {Router} from '@angular/router';
import { StoreService, UserData } from '../services/store.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab,
    IonNote, IonItem, IonList, IonButton,
    IonButtons, IonLabel, IonContent,
    IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule]
})
export class UsersPage implements OnInit {

  ngOnInit() {
  }

  users: UserData[] = [];
  selectedUserId: string | null = null;

  constructor(private router: Router, private store: StoreService)
  {
    // add icon here later
  }

  // (Ionic) is called every time user comes back to this page
  async ionViewWillEnter()
  {
    // call my function to refresh page (in case any users were added)
    await this.refresh();
  }

  private async refresh()
  {
    // attempt to refresh page when displayed
    await this.store.loadUsers();
    this.users = this.store.users;

    // try to get selected user
    this.selectedUserId = await this.store.getSelectedUserId();
  }

  // method for setting selected user by ID
  async selectUser(id: string)
  {
    await this.store.setSelectedUser(id);
    this.selectedUserId = id;
  }
  
  
  // method opens up a page for creating a new user
  createNewUser()
  {
    this.router.navigate(['/tabs/user-create']);
  }

  // method for deleting a user
  async deleteUser(id: string)
  {
    // get confirmation
    const ok = confirm('Delete this user with all his measurements ?');
    
    // user changed his mind, dont delete
    if (!ok)
    {
      return;
    }

    // confirmed, delete user by id
    await this.store.deleteUser(id);
    await this.refresh();  // refresh page after delete
  }
}
