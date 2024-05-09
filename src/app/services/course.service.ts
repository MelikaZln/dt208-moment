import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Course} from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  
  private url: string = "assets/ramschema_ht23.json";

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(this.url);

  }
}
