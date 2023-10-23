import { Component, OnDestroy, OnInit } from '@angular/core';
import { Patient } from '../interfaces/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  submitted = false;
  formdata!: FormGroup;
  patient!: Patient;
  successMessage = false;
  id!: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private patientService: PatientService,) {
                this.formdata = this.fb.group({
                  firstname: ['', Validators.required],
                  lastname: ['', Validators.required],
                  email: ['', Validators.required],
                  age: [0, Validators.required],
                  gender: [Validators.required],
                  avatar: []
                });
              }
  
  ngOnInit() { 
    this.successMessage = false;
    // Get route id
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.id = id;
      this.patientService.getPatientById(id).subscribe(pat => {
        this.patient = pat;
        this.initializeForm(pat);
      });
    } 
  }


  /**
   * Initialize form with patient data or empty
   * @param patientData 
   */
  initializeForm(patientData: Patient) {
    this.formdata = this.fb.group({
      firstname: [patientData.firstname],
      lastname: [patientData.lastname],
      email: [patientData.email],
      age: [patientData.age],
      gender: [patientData.gender],
      avatar: [patientData.avatar]
    });
    
  }

 /**
  * Create new patient or edit existing onecd
  * @param data 
  */
  submitForm() {
    const newPatient: Patient = this.formdata.value; //updated video object
    if (this.patient) {
      newPatient.id = this.patient.id;
      newPatient.avatar = this.patient.avatar;
      this.patientService.editPatient(this.id, newPatient)
      .subscribe(patient => {
        this.successMessage = true;
        this.patient = patient;
      });
    } else {
      newPatient.avatar = "http://dummyimage.com/194x100.png/dddddd/000000";
      this.patientService.addPatient(newPatient)
      .subscribe(patient => {
        this.patient = patient;
        this.successMessage = true;
      });
    }
  }

  /**
   * Go to patient list view
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Cancel subscriptions to prevent memory leaks
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
