import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Patient } from './../models/patient.model';
import { PATIENTS } from '../data/mock_data';

@Injectable({ providedIn: 'root' })
export class PatientService {

  data: any = PATIENTS;

  constructor() { }


  /**
   * Get patient by id
   * @param id: patient id
   * @returns patient object
   */
  getPatient(id: number): Observable<Patient> {
    const patient = this.data.find((h: { patient_id: number; }) => h.patient_id === id)!;
    console.log('Getting patient with id: ' + id);
    return of(patient);
  }

  /**
   * Delete patient from list temporarily (when refreshing patient is back)
   * @param id: patient id to delete
   * @returns updated list of patients
   */
  deletePatient(id: number): Observable<Patient[]> {
    const patient = this.data.find((p: { patient_id: number; }) => p.patient_id === id);
    const index: number = this.data.indexOf(patient);
    if (index !== -1) {
        this.data.splice(index, 1);
    } 
    console.log('Deleting patient with id: ' + id);
    return of(this.data);
  }
}