import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonList, IonRadio, IonRadioGroup, IonButton, IonLabel, IonDatetime, IonFabButton, IonFab } from '@ionic/angular/standalone';

type Gender = 'male'|'female';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.page.html',
  styleUrls: ['./user-create.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, IonFab, IonFabButton, IonRadioGroup,
    IonRadio, IonList, IonInput, IonItem, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,
    IonLabel, IonDatetime]
})
export class UserCreatePage implements OnInit {

  //userHeightInput = new FormControl<string>('')

  inputName = new FormControl<string>('')
  inputDateOfBirth = new FormControl('')
  inputHeight = new FormControl<number>(0)
  inputGender = new FormControl<Gender>('male', {nonNullable:true});

  constructor() { }

  ngOnInit() {
  }

  createNewUser()
  {
    // prep payload for creating a database entry
    const payload = {
      name: (this.inputName.value ?? '').trim(),
      dateOfBirth: (this.inputDateOfBirth.value ?? '').slice(0, 10),
      heightCm: this.inputHeight.value == null ? null : Number(this.inputHeight.value),
      gender: this.inputGender.value,
    };

    console.log('Created user payload:', payload);
  }

}
