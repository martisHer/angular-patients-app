import { Component, OnDestroy, OnInit } from '@angular/core';
import { Patient } from '../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit,OnDestroy {

  patient: Patient | undefined;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Get route id
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPatientById(id);
  }


  /**
   * Get patient by id
   * @param id patient id
   */
  getPatientById(id: number): void {
    this.patientService.getPatientById(id)
    .subscribe(patient => {
      this.patient = patient;
    });
  }

  /**
   * Go to patient list view
   */
  goBack(): void {
    this.location.back();
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
      console.log("Patient deleted. Id: " + pat.id);
      this.goBack();
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
