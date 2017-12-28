
import { AppointmentsSeed } from '../appointments.seed';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { map } from 'rxjs/operators';

import { AppointmentsService } from '../services/appointments.service';

import * as moment from 'moment';

import { Appointment } from '../models/appointment';
import { Calendar } from '../models/calendar';
import { Moment } from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  dayEvents: Appointment[] = [];
  allEvents_: Appointment[] = [];
  selectedDate: any;
  calendar: any[] = [];
  currentMonth: string;
  startDay: Moment = moment();
  endDay: Moment = moment();

  constructor(
    private http: HttpClient, private appointmentsService: AppointmentsService) { 
      this.selectedDate = moment('2017-12-18');
      this.currentMonth = moment().format('M');
    }

  ngOnInit() {
    this.loadDb();
  }

  nextMonth() {
    this.changeMonth(1);
  }

  beforeMonth() {
    this.changeMonth(-1);
  }

  changeDate(date) {
    this.selectedDate = moment(date);
    this.filterEvents();
  }

  addEvent($event) {
    const _event = $event.value;
    if (!_event.trim()) { return; }
    const date = this.selectedDate.format('YYYY-MM-DD');
    const title = _event;
    this.allEvents_.push({date, title} as Appointment);
    this.appointmentsService.addAppointment({date, title} as Appointment);
    this.createCalendar();
    this.filterEvents();
    $event.value = '';
  }

  private changeMonth(change: number) {
    this.startDay =  this.startDay.add(change, 'month');
    this.endDay = this.endDay.add(change, 'month');
    this.currentMonth = this.startDay.format('M');
    this.selectedDate = this.startDay.clone().startOf('month').startOf('day');
    this.createCalendar();
  }

  createCalendar() {
        this.calendar = [];
        const index = this.startDay.clone().startOf('month').startOf('week');

        const events = this.allEvents_;

        for (let i = 0; i <= 5; i++ ) {
          this.calendar.push(
            new Array(7).fill(0).map(
                function() {

                  const day = new Calendar();
                  day.dateString = index.format('YYYY-MM-DD');
                  day.hasEvent = events.some(x => x.date === index.format('YYYY-MM-DD'));
                  day.dayMoment = index.clone();
                  index.add(1, 'days');

                  return day;
                }
            )
          );
        }

        console.log(this.calendar);
  }

  private filterEvents() {
      this.dayEvents = this.allEvents_.filter(x => x.date === this.selectedDate.format('YYYY-MM-DD'));
  }

  private loadDb() {

    this.appointmentsService.getAppointments().subscribe(appointments => {
      this.calendar = [];
      const index = this.startDay.clone().startOf('month').startOf('week');

      for (let i = 0; i <= 5; i++ ) {
        this.calendar.push(
          new Array(7).fill(0).map(
              function() {

                const day = new Calendar();
                day.dateString = index.format('YYYY-MM-DD');
                day.hasEvent = appointments.some(x => x.date === index.format('YYYY-MM-DD'));
                day.dayMoment = index.clone();
                index.add(1, 'days');

                return day;
              }
          )
        );
      }

      this.allEvents_ = appointments;
      this.filterEvents();

    }, () => { console.log('verificar pq n funciona'); });
  }
}
