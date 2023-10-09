import { Component } from '@angular/core';
import { Patient } from '../models/patient.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent {
  submitted = false;
  formdata!: FormGroup;
  patient!: Patient;
  successMessage = false;
  updatedMessage = false;
  id!: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private patientService: PatientService,) {}
  
  ngOnInit() { 
    this.successMessage = false;
    this.updatedMessage = false;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.id = id;
      this.patientService.getPatient(id).subscribe(pat => {
        this.patient = pat;
        this.initializeForm(pat);
      });
    } else {
      this.initializeForm();
    }   
  }


  /**
   * Initialize form with patient data or empty
   * @param patientData 
   */
  initializeForm(patientData?: Patient) {
    if (patientData !== undefined) {
      this.formdata = this.fb.group({
        firstname: [patientData.first_name],
        lastname: [patientData.last_name],
        email: [patientData.email],
        age: [patientData.age],
        gender: [patientData.gender],
        avatar: [patientData.avatar]
      });
    } else {
      this.formdata = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', Validators.required],
        age: [0, Validators.required],
        gender: [Validators.required],
        avatar: []
      });
    }
  }

 /**
  * Create new patient or edit existing one
  * @param data 
  */
  submitForm(data: FormGroup) {
    let newPatient = new Patient();
    
    newPatient.first_name = data.value.firstname;
    newPatient.last_name = data.value.lastname;
    newPatient.email = data.value.email;
    newPatient.age = data.value.age;
    newPatient.gender = data.value.gender;

    if (this.patient) {
      newPatient.patient_id = this.patient.patient_id;
      newPatient.avatar = this.patient.avatar;
      this.patientService.findAndUpdate(this.id, newPatient)
      .subscribe(patient => {
        this.updatedMessage = true;
      });
    } else {
      // Generate random id greather than 200
      newPatient.patient_id = Math.floor(Math.random() * 100) + 200;
      newPatient.avatar = "http://dummyimage.com/194x100.png/dddddd/000000";
      this.patientService.addPatient(newPatient)
      .subscribe(patient => {
        this.patient = patient;
        this.successMessage = true;
      });
    }

  }


}
