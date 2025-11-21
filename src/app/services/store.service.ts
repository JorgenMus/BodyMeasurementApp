import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/* types */
export type genderType = 'male' | 'female';
export type ISODate = `${number}-${number}-${number}`;  // standard ISO-8601: "YYYY-MM-DD"

export interface UserData
{
  id: string;  // unique id of each user
  name: string;
  dateOfBirth: ISODate;  // e.g. "1990-08-30"
  heightCm: number;  //cm
  gender: genderType;
}

export interface UserMeasurementData
{
  id: string;
  userId: string;  // UserData.id

  measurementDateISO: ISODate;

  weightKg?: number;

  // extend later:
  upperChest?: number;
  chest?: number;
  belly?: number;
  ass?: number;
  thighL?: number;
  thighR?: number;
  calfL?: number;
  calfR?: number;
  bicepsL?: number;
  bicepsLflex?: number;
  bicepsR?: number;
  bicepsRflex?: number;
}

/* used keys in methods */
const KEY_USERS = 'users';
const KEY_MEASUREMENTS = 'measurements';
const KEY_SELECTED_USER = 'selectedUser';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  users: UserData[] = [];  // an array of users
  measurements: UserMeasurementData[] = [];  // array of measurements
  selectedUserId: string | null = null;  //selected user (his ID), initialized with NULL


  // method for storing user (passed user will omit given ID, this method create unique ID using crypto)
  async storeUser(userData: UserData): Promise<UserData>
  {
    // newest user on top
    this.users.unshift(userData);

    // store user
    Preferences.set({
      key: 'KEY_USERS',
      value: JSON.stringify(this.users),
    });

    // auto select newly created user
    await this.setSelectedUser(userData.id);

    return userData;
  }

  // method sets the selected user
  async setSelectedUser(id: string | null): Promise<void> {
    this.selectedUserId = id;

  
    // if ID was given and ID exists among users store as selected user to preferences
    if (id)
    {
      // check if id exists among users

      // store selected user
      await Preferences.set({key: KEY_SELECTED_USER, value: id});
    }

    // otherwise ignore
    else return;
  }

  // get the data of the currently selected user
  async getSelectedUser(): Promise<UserData | null> {
    // return user data that matched selected user's ID or return NULL
    return this.users.find(u => u.id === this.selectedUserId) ?? null;
  }
  // method for retrieving users from memory
  async loadUsers(): Promise<void>{
    // value is data from the memory (preferences - users)
    const {value} = await Preferences.get({key: 'KEY_USERS'});

    // if data present, parse
    if (value)
    {
      this.users = JSON.parse(value);
    }
  }

  // method for storing a measurement for a user
  async storeMeasurement(userMeasurementData: UserMeasurementData): Promise<void>
  {
    // todo
  }

  async loadMeasurements(): Promise<void>
  {
    // todo
  }
}
