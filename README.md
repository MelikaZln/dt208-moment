# Members

Det här är uppgiftsbeskrivningen till Moment  i kursen dt208g, Till den här momenten skulle vi göra en webb-applikation med Angular. Webb appen ska hämta data från en external json-fil från https://webbutveckling.miun.se/files/ramschema_ht23.json och läsa den på skärmen. Man ska kunna sortera kurserna efter kurskod, kursnamn och progression. Dessutom ska man också kunna söka efter en kurs antingen efter dess kurskod eller kursnamn.
Här ska jag beskriva vad jag har gjort för att lösa uppgiften, först av allt började jag min angular projekt med kommandot ng new members. Sedan sparade jag json-filen under katalogen assets. Till projektet gjorde jag en component som heter courses, jag skapade service till det och interface under mappen model. 
Sedan skrev jag in i app.routes.ts import { Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';

export const routes: Routes = [
    {path: "courses", component: CoursesComponent},
    {path: '', redirectTo: '/courses' , pathMatch: 'full'},
];
Så att när man skriver localhosten ska man direkt komma till members. 
I interface alltså course.ts skrev jag 
export interface Course {
    code: string,
    coursename: string,
    progression: string,
    syllabus: string
}
För att definiera typen av varje variabel som jag har med i json-filen. 

Under services har jag course.service.ts filen där jag skrev:
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

Istället för att använda mig av fetch-anrop använde jag HttpClient metoder. Jag använde get för att hämta data från json-filen. jag skrev import { HttpClient } from '@angular/common/http'; för att importera HttpClient och   constructor(private http: HttpClient) {} för att initera dependency injection. För att hantera asynkrona datamönster måste man implementera RxJs-kod. För att ha Http-anrop använder man Observable så jag skrev   getCourses(): Observable<Course[]>{...} 

Jag tog bort all kod i app.component.html förutom 
<router-outlet />.
I styles.css skrev jag bara stil till body och resten av min css kod har jag i courses.somponent.css. 
Här är min courses.component.html:

<div class="container">
<h2>Kurserna till Webbutvecklingsprogrammet</h2>
<div class="filter">
    <label for="filter" id="filter" >Sök kurs:</label>
    <input class="input" placeholder="Kurskod eller kursnamn..." type="text" id="filter" [(ngModel)]="filterValue" (input)="applyFilter()" >
</div>
@if(filteredCourseList.length === 0){
    <p>Inga kurser hittades</p>
}
    <table>
        <thead>
          <tr id="rubrik">
            <th>Kurskod</th>
            <th> Kursnamn</th>
            <th>Progression</th> 
          </tr>
        </thead>
        <tbody id="kurslist">
          <tr *ngFor="let course of filteredCourseList">
            <td>{{ course.code }}</td>
            <td>{{ course.coursename }}</td>
            <td>{{ course.progression }}</td>
          </tr> 
        </tbody>
      </table>
      <button (click)="sortTableBy('code')">Sortera efter Kurskod</button>
      <button (click)="sortTableBy('coursename')">Sortera efter Kursnamn</button>
      <button (click)="sortTableBy('progression')">Sortera efter Progression</button>
      
</div>
jag har en container som innehåller sökfältet och tabellen som visar alla kurser och knappar för att sortera kurserna. 
[(ngModel)]="filterValue", det här är en tvåvägs databindning som är en del av Angulars forms-modul. Det betyder att värdet som användaren skriver i sökfältet kommer att bindas till variabeln filterValue i komponenten och vica versa. 
(input)="applyFilter()" det är händelsehanterar som lysnnar när användaren skriver något i sökfältet kommer att funktionen applyFilter() köras. 
@if(filteredCourseList.length === 0){
    <p>Inga kurser hittades</p>
} Om användaren skriver en sträng som finns varken i kurskod eller kursnamn så får den detta meddelande "Inga kurser hittades". Sedan har jag tabellen, Den första rowen innehåller rubrik till varje kolumn.  <tr *ngFor="let course of filteredCourseList"> med *ngFor kan man loopa igenom objekt i filteredCourseList alltså den filterade kurslistan. 
  <td>{{ course.code }}</td>, <td>{{ course.coursename }}</td>, <td>{{ course.progression }}</td>: Innehåller data för varje kolumn alltså det binder datan från varje course objekt.

Här kommer min kod till course.component.ts
import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { CourseService } from '../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
  
  selector: 'app-courses',
  standalone : true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  Courselist: Course[] = [];
  filteredCourseList: Course[] = [];
  filterValue: string = "";

  constructor(private courseservice: CourseService,  private router: Router) { }

  ngOnInit(): void {
    this.courseservice.getCourses().subscribe(data => {
      this.Courselist = data;
      this.filteredCourseList = data;
    });
  }
  applyFilter(): void {
    this.filteredCourseList = this.Courselist.filter((course) => 
      (course.code.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      course.coursename.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
  }
  
  sortTableBy(property: keyof Course): void {
    this.Courselist.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
  }
  
}
För att kunna använda *ngFor har jag importeratCommonMoodule och för att använda OnInit har jag importerat OnInit. Jag har också importerat services och interface här. För att kunna använda funktionalitet för ett formulär har jag importerat FormsModule.


export class CoursesComponent implements OnInit {
  Courselist: Course[] = []; // här har jag en array av alla objekter som håller alla kurser.
  filteredCourseList: Course[] = []; // här har jag en array som håller alla filterade kurser 
  filterValue: string = ""; // här har jag en string som innehåller värdet från sökfältet
  
constructor(private courseservice: CourseService,  private router: Router) { } // det injicerar CourseSrvice och Router i komponentetn

  ngOnInit(): void {
    this.courseservice.getCourses().subscribe(data => { 
      this.Courselist = data;
      this.filteredCourseList = data;
    });
  }
 hämtar kurser från CourseService och datanb tilldelas i Courselist och filteredCourselist

   applyFilter(): void {
    this.filteredCourseList = this.Courselist.filter((course) => 
      (course.code.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      course.coursename.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
  } 
  Denna metod filterar kurserna baserad på värdet i säkfältet det går igenom både kurskod och kursnamn. Till sist tilldelas resultatet i filteredCourselist.

sortTableBy(property: keyof Course): void {
    this.Courselist.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
  } 
Denna metod sorterar kurserna baserat på den angivna egenskapen som kan vara coursecode, coursename och progression.  


