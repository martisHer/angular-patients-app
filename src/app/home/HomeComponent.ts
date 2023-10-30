import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PatientService } from '../services/patient.service';
import { Diagnose, Patient } from '../interfaces/interfaces';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  loaded1 = false;

  private ngUnsubscribe = new Subject<void>();
  
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Bar Chart Gender
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Patient Gender'
      }
    },
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: ['Gender'],
    datasets: [
      { data: [], label: '' },
      { data: [], label: '' }
    ]
  }

  // Pie Chart Age
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      title: {
        display: true,
        text: 'Patient By Age'
      }
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['18-30y', '31-45y', '>45y'],
    datasets: [
      {
        data: [],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.getPatients();
  }

  /**
   * Get list of patients and initialize table
   */
  getPatients(): void {
    this.patientService.getPatients()
      .subscribe(patients => {
        this.pieChartData.datasets = [
          {
            data: this.getDataByAges(patients)
          }
        ];
        this.barChartData.datasets = [
          { data: this.countByGender(patients, 'Female'), label: 'Female' },
          { data: this.countByGender(patients, 'Male'), label: 'Male' }
        ];
        this.loaded1 = true;
      });
  }

  /**
   * Group patients by age in 3 different ranges of age (18-30, 31-45, >45)
   * @param patients list of patients
   * @returns array of ages counting
   */
  getDataByAges(patients: Patient[]): number[] {
    let counter30 = 0;
    let counter45 = 0;
    let counter18 = 0;
    patients.forEach(element => {
      if (element.age >= 18 && element.age <=30) {
        counter18 ++;
      } else if (element.age > 30 && element.age <= 45) {
        counter30 ++;
      } else {
        counter45 ++;
      }
    });
    return [counter18, counter30, counter45];
  }

  countByGender(patients: Patient[], gender: string): number[] {
    const countArray = [];
    const count =patients.filter((patient) => patient.gender === gender).length;
    countArray.push(count);
    return countArray;
  }


  /**
   * Cancel subscriptions to prevent memory leaks
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
