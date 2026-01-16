import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ISODate } from '../services/store.service';

@Component({
  selector: 'app-measurement-create',
  templateUrl: './measurement-create.page.html',
  styleUrls: ['./measurement-create.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule]
})
export class MeasurementCreatePage implements OnInit {
  // remember selected user the measurement is for
  selectedUserId: string | null = null;

  // fields in the form
  measurementDateISO: ISODate = this.todayISO();  // autofill current date
  weightKg: string = '';
  upperChest: string = '';
  belly: string = '';
  bottom: string = '';
  bicepsL: string = '';
  bicepsR: string = '';
  thighL: string = '';
  thighR: string = '';


  constructor() { }

  ngOnInit() {
  }

  // helper method for getting current ISODate in proper format
  private todayISO(): ISODate
  {
    // database expects 10 character long ISODate - hence slice(0,10)
    return new Date().toISOString().slice(0,10) as ISODate;
  }
}
