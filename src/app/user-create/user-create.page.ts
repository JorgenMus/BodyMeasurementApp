import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonList, IonRadio, IonRadioGroup, IonButton, IonLabel, IonDatetime, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { ISODate, StoreService, UserData } from '../services/store.service';
import { Router } from '@angular/router';

type Gender = 'male'|'female';

// helper for creating new unique ID's
const newId = () =>
  crypto.randomUUID()

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.page.html',
  styleUrls: ['./user-create.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, IonFab, IonFabButton, IonRadioGroup,
    IonRadio, IonList, IonInput, IonItem, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule,
    IonLabel, IonDatetime]
})
export class UserCreatePage implements OnInit {
  inputName = new FormControl<string>('')
  inputDateOfBirth = new FormControl('')
  inputHeight = new FormControl<number>(0)
  inputGender = new FormControl<Gender>('male', {nonNullable:true});

  constructor(private store: StoreService, private router: Router) { }

  ngOnInit() {
  }

    async createNewUser() {
    const user: UserData = {
      id: newId(),
      name: (this.inputName.value ?? '').trim(),
      dateOfBirth: (this.inputDateOfBirth.value ?? '').slice(0, 10) as ISODate,
      heightCm: this.inputHeight.value == null ? 0 : Number(this.inputHeight.value),
      gender: this.inputGender.value as Gender,
    };

    await this.store.loadUsers();            // refresh in-memory cache
    await this.store.storeUser(user);        // just stores (no id creation)
    await this.store.setSelectedUser(user.id);
    this.router.navigate(['/tabs/users']);   // or '/tabs/measurements' i will decide later  // TODO
  }
}
