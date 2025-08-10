import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'prijavi-ffd';
}
