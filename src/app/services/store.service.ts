import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/* types */
export type genderType = 'male' | 'female';
export type ISODate = `${number}-${number}-${number}`;  // standard ISO-8601: "YYYY-MM-DD"

export interface UserRecord
{
  id: String;  // unique id of each user
  name: String;
  dateOfBirth: ISODate;  // e.g. "1990-08-30"
  heightCm: number;  //cm
  gender: genderType;
}

export interface UserMeasurement
{
  id: string;
  // TODO
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // method for storing data
  async storeUser()
  {

  }
}
