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
