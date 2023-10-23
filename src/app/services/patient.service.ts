import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Patient } from '../interfaces/interfaces';
import { API } from './constants';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PatientService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get list of patients from json-server
   * @returns list of patients
   */
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${API}/patients`);
  }

  /**
   * Get patient by id and it maps the result to a single patient
   * @param id patient id
   * @returns patient
   */
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient[]>(`${API}/patients?id=${id}`).pipe(
      map(patients => {
        if (patients.length > 0) {
          return patients[0];
        } else {
          throw new Error("Patient not found");
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete patient given patient id
   * @param id patient id
   * @returns 
   */
  deletePatient(id: number): Observable<Patient> {
    return this.http.delete<Patient>(`${API}/patients/${id}`, this.httpOptions);
  }


  /**
   * Create new patient and add it to json-server
   * @param patient patient to add
   * @returns updated list of patients
   */
  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${API}/patients`, patient, this.httpOptions); 
  }

  /**
   * Find existing patient and update it
   * @param id patient id
   * @param newPatient new info
   * @returns 
   */
  editPatient(id: number, newPatient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${API}/patients/${id}`, newPatient, this.httpOptions);
  }


  /**
   * Catch errors in Http methods and throw an error message
   * @param error 
   * @returns 
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  
}