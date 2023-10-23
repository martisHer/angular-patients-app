import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Patient } from '../interfaces/interfaces';
import { PatientService } from '../services/patient.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

export interface DialogData {
  patient: number;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  displayedColumns: string[] = ['patientId', 'name', 'lastname', 'gender', 'details', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Patient>();
  patients: Patient [] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private patientService: PatientService,
    public dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.getPatients();
  }

  /**
   * Get list of patients and initialize table
   */
  getPatients(): void {
    this.patientService.getPatients()
    .subscribe(patients => {
      this.dataSource = new MatTableDataSource<Patient>(patients);
      this.dataSource.paginator = this.paginator;
      this.patients = patients;
    });
  }


  /**
   * Filter patient list by name, lastname or email
   * @param event query
   */
  queryPatient(event: Event) {
    var query = (event.target as HTMLInputElement).value;
    this.dataSource.filter = query.trim().toLocaleLowerCase();
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Filter patient by gender from select
   * @param gender Female or Male
   */
  filterByGender(gender: string) {
    this.clearFilter();
    this.dataSource.data = this.dataSource.data.filter(i => i.gender.toLocaleLowerCase() === gender.toLocaleLowerCase());
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Filter patient by age from select
   * @param age range 18-30, 31-45 or greater than 45
   */
  filterByAge(age: string) {
    this.clearFilter();
    var range = parseInt(age);
    if (range === 0) {
      this.dataSource.data = this.dataSource.data.filter(i => i.age >= 18 && i.age <= 30);
    } else if (range === 1) {
      this.dataSource.data = this.dataSource.data.filter(i => i.age > 30 && i.age <= 45);
    } else {
      this.dataSource.data = this.dataSource.data.filter(i => i.age > 45);
    }
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Clear list and update paginator
   */
  clearFilter() {
    this.dataSource = new MatTableDataSource<Patient>(this.patients);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Open deleting confirmation dialog
   * @param id patient id to delete
   */
  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {patient: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.deletePatient(result);
    });
  }

  /**
   * Delete patient
   * @param id patient id
   */
  deletePatient(id: number) {
    this.patientService.deletePatient(id)
    .subscribe(pat => {
      this.getPatients();
      console.log("Patient deleted. Id: " + pat.id);
    });
  }

  /**
   * Cancel subscriptions to prevent memory leaks
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
