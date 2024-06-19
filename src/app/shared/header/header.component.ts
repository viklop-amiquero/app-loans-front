import { Component, HostListener, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MatToolbarModule, MatIconModule, MatInputModule, 
    MatFormFieldModule, FormsModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = false;
  showMenu: boolean = false;

  ngOnInit() {
    this.checkIsMobile();
  }

  

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 480;
    if (!this.isMobile) {
      this.showMenu = true;
    }else{
      this.showMenu = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIsMobile();
  }
  clickMenu(){
    this.showMenu = !this.showMenu; 
    setTimeout(() => {
      this.showMenu = false;
    }, 2000);
  }

}
