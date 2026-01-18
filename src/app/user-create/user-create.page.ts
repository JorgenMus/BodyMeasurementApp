import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonList, IonRadio, IonRadioGroup, IonButton, IonLabel, IonDatetime, IonFabButton, IonFab, IonButtons } from '@ionic/angular/standalone';
import { ISODate, StoreService, UserData } from '../services/store.service';
import { Router } from '@angular/router';

type Gender = 'male'|'female';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.page.html',
  styleUrls: ['./user-create.page.scss'],
  standalone: true,
  imports: [IonButtons, 
    ReactiveFormsModule, IonButton, IonRadioGroup,
    IonRadio, IonList, IonInput, IonItem, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule,
    IonLabel, IonDatetime]
})
export class UserCreatePage implements OnInit {
  inputName = new FormControl<string>('');
  inputDateOfBirth =  new FormControl<ISODate>('' as ISODate);
  inputHeight = new FormControl<number>(0);
  inputGender = new FormControl<Gender>('male', {nonNullable:true});

  constructor(private store: StoreService, private router: Router) { }

  ngOnInit() {
  }

  // when entering the page (ionic lifecycle) reset values in fields
  ionViewWillEnter()
  {
    // reset fields (otherwise they stay in memory)
    this.inputName.reset('');
    this.inputDateOfBirth.reset();
    this.inputHeight.reset();
    this.inputGender.reset('male');
  }

  // method validates values in input fields and store new user
  async createNewUser()
  {
    // validate name
    const name = (this.inputName.value ?? '').trim();
    if (name === '')  // dont accept empty name
    {
      alert('Please input a name.');
      return;
    }

    // validate date of birth
    const dateOfBirth_raw = this.inputDateOfBirth.value ?? '';  // if input is null use ''
    if(dateOfBirth_raw.length < 10)
    {
      alert('Please pick a date.');
      return;
    }

    // collect data for the user
    const user: UserData = {
      id: crypto.randomUUID(),
      name: name,
      dateOfBirth: dateOfBirth_raw as ISODate,  // 10 characters: "YYYY-MM-DD"
      
      // if no height then 0 otherwise create the number from input
      heightCm: this.inputHeight.value == null ? 0 : Number(this.inputHeight.value),
      gender: this.inputGender.value as Gender,
    };

    await this.store.loadUsers();            // refresh in-memory cache
    await this.store.storeUser(user);        // store this user (it also sets him as selected)

    // go back to users tab
    this.router.navigate(['/tabs/users']);   // return to users tab
  }

  cancel()
  {
    this.router.navigate(['/tabs/users']);
  }
}
