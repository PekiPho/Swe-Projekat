import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
@Component({
  selector: 'app-main-page',
  imports: [ NavbarComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  sortMenuOpen = false;

  toggleSortMenu() {
    this.sortMenuOpen = !this.sortMenuOpen;
  }

  sortBy(type: string) {
    console.log(`Sorting by ${type}`);
    this.sortMenuOpen = false;
  }

  
}
