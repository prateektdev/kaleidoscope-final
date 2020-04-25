import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-course',
  templateUrl: 'course.page.html',
  styleUrls: ['course.page.scss'],
})
export class CoursePage {
  semester:any;

  constructor(private route: ActivatedRoute) {
    console.log('here')
    this.route.queryParams.subscribe(params => {
      this.semester = JSON.parse(params["semester"]);
    });

  }


}
