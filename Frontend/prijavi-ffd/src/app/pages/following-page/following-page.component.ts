
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common'; 
import { UserService } from '../../../services/user.service'; 
import { Report } from '../../../interfaces/report';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-following-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule, DatePipe],
  templateUrl: './following-page.component.html',
  styleUrl: './following-page.component.scss'
})
export class FollowingPageComponent implements OnInit {
  
  followingReports$: Observable<Report[] | null>;

  constructor(private userService: UserService) {
    this.followingReports$ = of(null);
  }

  ngOnInit(): void {
    const user = this.userService.userSource.value;

    if (user && user.username) {
      this.followingReports$ = this.userService.getReportsThatUserIsFollowing(user.username).pipe(
        catchError(error => {
          console.error('Greška pri dohvatanju praćenih objava:', error);
          return of([]);
        })
      );
    } else {
      this.followingReports$ = of([]);
    }
  }
}