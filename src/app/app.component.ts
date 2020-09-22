import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Papa from 'papaparse';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'poc-excel-reader';

  loading = false;
  name = 'Angular 5 csv file parser example';
  dataList: any[] = [];

  counter: number = 0;
  timerRef;
  running: boolean = false;
  startText = 'Start';

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  onChange(files: File[]) {
    try {
      this.loading = true;
      this.startTimer();
      if (files[0]) {
        console.log(files[0]);
        Papa.parse(files[0], {
          header: false,
          skipEmptyLines: true,
          complete: (result, file) => {
            this.loading = false;
            clearInterval(this.timerRef);
            console.log(result);
            this.dataList = result.data;
          },
          error: (error) => {
            this.loading = false;
            clearInterval(this.timerRef);
            console.log(error);
          }
        });
      }
    } catch (error) {
      this.loading = false;
      clearInterval(this.timerRef);
    }

  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      this.startText = 'Stop';
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
      });
    } else {
      this.startText = 'Resume';
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.running = false;
    this.startText = 'Start';
    this.counter = undefined;
    clearInterval(this.timerRef);
  }

  async submitData() {
    const payload = {
      data: this.dataList.map(d => d[0])
    };
    console.log(payload);
    const res = await this.http.post('http://localhost:3000/AZauth/api/mm/sendnoti', payload).toPromise();
  }
  ngOnDestroy() {
    clearInterval(this.timerRef);
  }
}
