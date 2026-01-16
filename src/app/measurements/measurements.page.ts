import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.page.html',
  styleUrls: ['./measurements.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonLabel]
})
export class MeasurementsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
