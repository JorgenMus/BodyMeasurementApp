import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/* types */
export type genderType = 'male' | 'female';
export type ISODate = `${number}-${number}-${number}`;  // standard ISO-8601: "YYYY-MM-DD"

export interface UserData
{
  id: string;  // unique id of each user
  name: string;
  dateOfBirth: ISODate;  // format: "1990-08-30"
  heightCm: number;  //cm
  gender: genderType;
}

export interface UserMeasurementData
{
  measurementId: string;
  userId: string;  // UserData.id

  measurementDateISO: ISODate;

  weightKg?: number;

  // body measurements (cm)
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
    await Preferences.set({
      key: KEY_USERS,
      value: JSON.stringify(this.users),
    });

    // auto select newly created user
    await this.setSelectedUser(userData.id);

    return userData;
  }

  // method deletes a user
  async deleteUser(userId: string): Promise<void>
  {
    // make sure arrays are up to date
    await this.loadUsers();
    await this.loadMeasurements();

    // check if user exists (if not return)
    const exists = this.users.some(u => u.id === userId)
    if (!exists)
      return;

    // delete user by filtering him out of the array
    this.users = this.users.filter(u => u.id !== userId);
    
    // delete measurements by filtering them out (based on userId)
    this.measurements = this.measurements.filter(m => m.userId !== userId);

    // if deleted user was also selected user, delete selection
    if (this.selectedUserId === userId)
    {
      this.selectedUserId = null;
      await Preferences.remove({key: KEY_SELECTED_USER});
    }

    // save updated arrays to preferences
    await Preferences.set({
      key: KEY_USERS,
      value: JSON.stringify(this.users),
    });
    await Preferences.set({
      key: KEY_MEASUREMENTS,
      value: JSON.stringify(this.measurements),
    });
  }

  // method sets the selected user
  async setSelectedUser(id: string | null): Promise<void>
  {
    // if no id given delete selection and return
    if (!id)
    {
      this.selectedUserId = null;
      await Preferences.remove({key:KEY_SELECTED_USER});
      return;
    }

    // id was given check if such an user exists
    const exists = this.users.some(u =>u.id === id);
    if (!exists)
      return;  // no such user exists

    // user found set him as selected and update preferences
    await Preferences.set({
      key: KEY_SELECTED_USER,
      value: id,
    });
    this.selectedUserId = id;
  }

  // get the data of the currently selected user
  async getSelectedUser(): Promise<UserData | null> {
    // return user data that matched selected user's ID or return NULL
    return this.users.find(u => u.id === this.selectedUserId) ?? null;
  }
  
  // method for retrieving users from memory
  async loadUsers(): Promise<void>{
    // value is data from the memory (preferences - users)
    const {value} = await Preferences.get({key: KEY_USERS});

    // if data present, parse
    if (value)
    {
      this.users = JSON.parse(value);
    }
    else
      this.users = [];  // no users loaded
  }

  // method returns the ID of a currently selected user
  async getSelectedUserId(): Promise<string | null> {

    // reload from preferences (in case of restart of the app)
    const {value} = await Preferences.get({
      key: KEY_SELECTED_USER
    });

    this.selectedUserId = value ?? null;

    return this.selectedUserId;
  }

  // method for storing a measurement for a user
  async storeMeasurement(userMeasurementData: UserMeasurementData): Promise<void>
  {
    // update measurements and users
    await this.loadUsers();
    await this.loadMeasurements();

    // check if user from measurements exists
    const userExists = this.users.some(u=> u.id === userMeasurementData.userId);

    // if user does not exist return
    if (!userExists)
      return;

    // store measurement data to the start of array
    this.measurements.unshift(userMeasurementData);

    // store to preferences updated data
    await Preferences.set({
      key: KEY_MEASUREMENTS,
      value: JSON.stringify(this.measurements),
    });
  }

  // method for retrieving measurements from memory
  async loadMeasurements(): Promise<void>
  {
    const {value} = await Preferences.get({
      key: KEY_MEASUREMENTS,
    });

    // if data present, parse
    if (value)
    {
      this.measurements = JSON.parse(value);
    }
    else
    {
      this.measurements = [];  // no data avaiable
    }
  }

  // method for deleting a measurement based on its ID
  async deleteMeasurement(measurementId: string): Promise<void>
  {
    // get current  data
    await this.loadMeasurements();

    // delete given measurement by filtering it out
    this.measurements = this.measurements.filter(m=>m.measurementId !== measurementId);

    // update preferences
    await Preferences.set({
      key: KEY_MEASUREMENTS,
      value: JSON.stringify(this.measurements),
    });
  }

  // method for getting measurements data for a specific user
  async getMeasurementsForUser(userId: string): Promise<UserMeasurementData[]>
  {
    // update data
    await this.loadMeasurements();

    // filter out only users measurements and return them
    return this.measurements.filter(m=>m.userId === userId);
  }
}
