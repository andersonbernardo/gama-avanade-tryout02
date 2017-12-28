import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Appointment } from '../models/appointment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AppointmentsService {

  private appointmentUrlApi = 'api/appointments';  // URL to web api

  constructor(
    private http: HttpClient) { }


  getAppointments (): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.appointmentUrlApi)
      .pipe(
        tap(heroes => this.log(`fetched Appointment`)),
        catchError(this.handleError('getAppointments', []))
      );
  }

  getAppointment(id: number): Observable<Appointment> {
    const url = `${this.appointmentUrlApi}/${id}`;
    return this.http.get<Appointment>(url).pipe(
      tap(_ => this.log(`fetched appointment id=${id}`)),
      catchError(this.handleError<Appointment>(`getAppointMent id=${id}`))
    );
  }

  addAppointment (appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.appointmentUrlApi, appointment, httpOptions).pipe(
      tap((appointment: Appointment) => this.log(`added appointment w/ id=${appointment.id}`)),
      catchError(this.handleError<Appointment>('addAppointment'))
    );
  }

  getAppontmentByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.appointmentUrlApi}/?date=${date}`).pipe(
      tap(_ => this.log(`found Appointment matching "${date}"`)),
      catchError(this.handleError<Appointment[]>('getAppontmentByDate', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}
