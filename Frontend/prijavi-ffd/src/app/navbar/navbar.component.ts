import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchActive = false;

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
  }
}
