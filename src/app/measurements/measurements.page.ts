import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonButtons, IonButton, IonList, IonItem, IonNote } from '@ionic/angular/standalone';

import { StoreService, UserData, UserMeasurementData } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.page.html',
  styleUrls: ['./measurements.page.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonButton, IonButtons, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonLabel, IonNote]
})
export class MeasurementsPage implements OnInit {

  // variables for storing selected user and his measurements data
  selectedUserId: string | null = null;
  selectedUser: UserData | null = null;
  measurements: UserMeasurementData[] = [];

  constructor(private store: StoreService, private router: Router)
  {
    // nothing for now
  }

  ngOnInit() {
  }

  // ionic automaticaly calls this whenever user enters this page
  async ionViewWillEnter()
  {
    // call my refresh method
    await this.refresh();
  }

  // method tries to load data and refreshes everything in page
  private async refresh()
  {
    // load users and selected user id
    await this.store.loadUsers();
    this.selectedUserId = await this.store.getSelectedUserId();

    // if no selected user ID was loaded, set measurements and user empty and return
    if (!this.selectedUserId)
    {
      this.measurements = [];
      this.selectedUser = null;
      return;
    }

    // find data for selected user
    this.selectedUser = await this.store.getSelectedUser();

    // selected user was loaded, load measurements for him
    this.measurements = await this.store.getMeasurementsForUser(this.selectedUserId);
  }

  // method navigates back to users page
  goToUsers()
  {
    this.router.navigate(['/tabs/users']);
  }

  // method opens a page for creating a new measurement (form)
  openCreateMeasurement()
  {
    this.router.navigate(['/tabs/measurement-create']);
  }

  // method deletes given measurement (based on given id)
  async deleteMeasurement(measurementId: string)
  {
    // get confirmation from user
    const ok = confirm('Delete this measurement ?');

    // if not confirmed return
    if (!ok)
      return;

    // if confirmed call the delete method on measurement and refresh
    await this.store.deleteMeasurement(measurementId);
    await this.refresh();
  }
}
