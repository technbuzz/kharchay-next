import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth, authState } from "@angular/fire/auth";
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';


@Component({
  selector: 'kha-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
