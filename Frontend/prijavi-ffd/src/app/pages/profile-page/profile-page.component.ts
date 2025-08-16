
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common'; 
import { UserService } from '../../../services/user.service'; 
import { Report } from '../../../interfaces/report';
import { Observable, of } from 'rxjs';
import { switchMap, filter, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule, DatePipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  
  userReports$: Observable<Report[] | null>;

  constructor(private userService: UserService) {
    this.userReports$ = of(null);
  }

  ngOnInit(): void {
    const user = this.userService.userSource.value;

    if (user && user.username) {
      this.userReports$ = this.userService.getReportsByUser(user.username).pipe(
        catchError(error => {
          console.error('Greška pri dohvatanju objava:', error);
          return of([]);
        })
      );
    } else {
      this.userReports$ = of([]);
    }
  }
}