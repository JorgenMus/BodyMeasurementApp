import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,
  IonToolbar, IonLabel, IonButton, IonButtons } from '@ionic/angular/standalone';

import { StoreService, UserData, UserMeasurementData } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonLabel, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule]
})
export class StatisticsPage implements OnInit {
  // remember selected user, his instance and his measurement data
  selectedUserId: string | null = null;
  selectedUser: UserData | null = null;
  measurements: UserMeasurementData[] = [];

  private static readonly MAX_GRAPH_POINTS = 30;  // maximum points in the graph

  // each chart (each bodypart) has its own url string
  weightChartUrl: string | null = null;
  upperChestChartUrl: string | null = null;
  bellyChartUrl: string | null = null;
  bottomChartUrl: string | null = null;
  bicepsLChartUrl: string | null = null;
  bicepsRChartUrl: string | null = null;
  thighLChartUrl: string | null = null;
  thighRChartUrl: string | null = null;

  constructor(private store: StoreService, private router: Router) { }

  // method which is called any time user enters this page
  async ionViewWillEnter()
  {
    // call my refresh method
    await this.refresh();
  }

  // method loads users,
  // checks if a user is selected and retrieves the user
  // if all ok then it retrieves his measurements data and builds the charts
  private async refresh()
  {
    // load users and selected user
    await this.store.loadUsers();
    this.selectedUserId = await this.store.getSelectedUserId();

    // if no user was selected go back and clear page
    if (!this.selectedUserId)
    {
      this.selectedUser = null;
      this.measurements = [];
      this.clearCharts();
      return;
    }

    // if no user was sucessfuly loaded clear and go back
    this.selectedUser = await this.store.getSelectedUser();
    if (!this.selectedUser)
    {
      this.selectedUserId = null;
      this.measurements = [];
      this.clearCharts();
      return;
    }

    // get measurements data for the selected user
    this.measurements = await this.store.getMeasurementsForUser(this.selectedUserId);

    //builg the charts
    this.buildCharts();
  }

  // helper method clears data from the charts (nulls the strings)
  private clearCharts()
  {
    this.weightChartUrl = null;
    this.upperChestChartUrl = null;
    this.bellyChartUrl = null;
    this.bottomChartUrl = null;
    this.bicepsLChartUrl = null;
    this.bicepsRChartUrl = null;
    this.thighLChartUrl = null;
    this.thighRChartUrl = null;
  }

  // method navigates to the users page
  goToUsers()
  {
    this.router.navigate(['/tabs/users']);
  }

  // method builds the URLs for each chart and retrieves from the API:
  // https://quickchart.io/chart with endpoint being the built strings
  // result from the API is an image of the graph
  private buildCharts()
  {
    // clear previous urls
    this.clearCharts();

    // if no measurements return
    if (!this.measurements || this.measurements.length === 0)
      return;

    // get the data from measurements (only allowed amount in MAX_GRAPH_POINTS)
    // after slicing reverse the order (needed for the REST API - from oldest to newest)
    const orderedMeasurements = this.measurements.slice(0,StatisticsPage.MAX_GRAPH_POINTS).reverse();

    // create labels from the dates of each measurement
    const labels = orderedMeasurements.map(m=>m.measurementDateISO);

    // if at least 1 value filled prepare the chart URLs
    this.weightChartUrl = this.buildChartURL(
      'Weight (kg)',
      labels,
      orderedMeasurements.map(m => m.weightKg ?? null),
      'Weight'
    );

    this.upperChestChartUrl = this.buildChartURL(
      'Upper Chest (cm)',
      labels,
      orderedMeasurements.map(m => m.upperChest ?? null),
      'Upper chest'
    );

    this.bellyChartUrl = this.buildChartURL(
      'Belly / Waist (cm)',
      labels,
      orderedMeasurements.map(m => m.belly ?? null),
      'Belly'
    );

    this.bottomChartUrl = this.buildChartURL(
      'Bottom (cm)',
      labels,
      orderedMeasurements.map(m => (m as any).bottom ?? null),
      'Bottom'
    );

    this.bicepsLChartUrl = this.buildChartURL(
      'Biceps Left (cm)',
      labels,
      orderedMeasurements.map(m => m.bicepsL ?? null),
      'Biceps L'
    );

    this.bicepsRChartUrl = this.buildChartURL(
      'Biceps Right (cm)',
      labels,
      orderedMeasurements.map(m => m.bicepsR ?? null),
      'Biceps R'
    );

    this.thighLChartUrl = this.buildChartURL(
      'Thigh Left (cm)',
      labels,
      orderedMeasurements.map(m => m.thighL ?? null),
      'Thigh L'
    );

    this.thighRChartUrl = this.buildChartURL(
      'Thigh Right (cm)',
      labels,
      orderedMeasurements.map(m => m.thighR ?? null),
      'Thigh R'
    );

  }

  // Builds 1 chart URL. Returns null if all values are empty.
  private buildChartURL(
    title: string,  // chart title
    labels: string[],  // expected to be dates of the measurements
    data: Array<number | null>,  // measurement data
    datasetLabel: string  
  ): string | null  // return built url string or null
  {
    // do not show chart if every value is null
    const hasAnyValue = data.some(v => v != null);
    if (!hasAnyValue)
      return null;

    // configure the chart based on given data
    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: datasetLabel,
            data,
            spanGaps: true,
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 4,
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 28, weight: 'bold' }, // chart name
          },
          legend: {
            display: false,
            labels: {
              font: { size: 18 } // legend (disabled) under name of the chart
            }
          },
          tooltip: {
            bodyFont: { size: 14 },
            titleFont: { size: 14 }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              font: { size: 24 } // X labels
            }
          },
          y: {
            ticks: {
              font: { size: 20 } // Y labels
            }
          }
        }
      }
    };

    return this.quickChartUrl(chartConfig);
  }

  // Builds final QuickChart image URL using query param `c` / `chart`
  private quickChartUrl(chartConfig: any): string
  {
    const base = 'https://quickchart.io/chart';

    // QuickChart supports `chart` or `c` param. :contentReference[oaicite:1]{index=1}
    const params = new URLSearchParams({
      c: JSON.stringify(chartConfig),
      width: '800',
      height: '400',
      format: 'png',
      backgroundColor: '#ffffff',
      version: '4',
      devicePixelRatio: '1',
    });

    return `${base}?${params.toString()}`;
  }

  ngOnInit() {
  }

}
