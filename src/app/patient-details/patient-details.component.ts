import { Component } from '@angular/core';
import { Patient } from '../models/patient.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent {
  patient: Patient | undefined;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPatient();
  }

  /**
   * Get patient from id
   */
  getPatient(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getPatient(id)
      .subscribe(pat => this.patient = pat);
  }

  /**
   * Go to patient list
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
    .subscribe(pat => 
      console.log("Patient deleted:" + pat));
      this.goBack();
  }

}
