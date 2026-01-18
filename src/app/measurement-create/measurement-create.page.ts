import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { ISODate, StoreService, UserMeasurementData } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-measurement-create',
  templateUrl: './measurement-create.page.html',
  styleUrls: ['./measurement-create.page.scss'],
  standalone: true,
  imports: [IonButtons, IonInput, IonButton, IonLabel,
    IonItem, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule,
    ReactiveFormsModule ]
})

export class MeasurementCreatePage implements OnInit {
  // remember selected user the measurement is for
  selectedUserId: string | null = null;

  // fields in the form
  // auto filled current date (only this is mandatory field)
  inputMeasurementDateISO =  new FormControl<ISODate>(this.todayISO(), { nonNullable: true });

  inputWeightKg = new FormControl<number | null>(null);

  inputUpperChest = new FormControl<number | null>(null);
  inputBelly = new FormControl<number | null>(null);
  inputBottom = new FormControl<number | null>(null);

  inputBicepsL = new FormControl<number | null>(null);
  inputBicepsR = new FormControl<number | null>(null);

  inputThighL = new FormControl<number | null>(null);
  inputThighR = new FormControl<number | null>(null);


  constructor(private store: StoreService, private router: Router) { }

  ngOnInit() {
  }

  // helper method resets fields in the form
  private resetForm()
  {
    this.inputMeasurementDateISO.setValue(this.todayISO());
    this.inputWeightKg.reset();
    this.inputUpperChest.reset();
    this.inputBelly.reset();
    this.inputBottom.reset();
    this.inputBicepsL.reset();
    this.inputBicepsR.reset();
    this.inputThighL.reset();
    this.inputThighR.reset();
  }

  // on enetering to measurement page, only loads selected user
  // if no user was selected go back to the tab users
  async ionViewWillEnter()
  {
    // reset form
    this.resetForm();

    // load data
    this.selectedUserId = await this.store.getSelectedUserId();

    // if no user selected go to users tab
    if (!this.selectedUserId)
    {
      // inform user to select a user and go back to users tab
      alert('Please select a user to which you want to add a measurement.');
      this.router.navigate(['/tabs/users']);
    }
  }

  async save()
  {
    // double check if user was selected (to which we want to store measurements)
    if (!this.selectedUserId)
      return;  // do nothing and return

    // get tge data
    const newMeasurement: UserMeasurementData = {
      measurementId: crypto.randomUUID(),
      userId: this.selectedUserId,

      // assign values from  formfields
      measurementDateISO: this.inputMeasurementDateISO.value,
      
      // optional values
      weightKg: this.inputWeightKg.value ?? undefined,

      upperChest: this.inputUpperChest.value ?? undefined,
      belly: this.inputBelly.value ?? undefined,
      bottom: this.inputBottom.value ?? undefined,

      bicepsL: this.inputBicepsL.value ?? undefined,
      bicepsR: this.inputBicepsR.value ?? undefined,

      thighL: this.inputThighL.value ?? undefined,
      thighR: this.inputThighR.value ?? undefined,
    }

    // save data
    await this.store.storeMeasurement(newMeasurement);

    // after saving go back to the tab measurements
    this.router.navigate(['/tabs/measurements']);
  }

  // helper method for canceling a measurement (goes back to measurements tab)
  cancel()
  {
    this.router.navigate(['/tabs/measurements']);
  }

  // helper method for getting current ISODate in proper format
  private todayISO(): ISODate
  {
    // database expects 10 character long ISODate - hence slice(0,10)
    return new Date().toISOString().slice(0,10) as ISODate;
  }
}
