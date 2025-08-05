import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../Serives/Chatservice/chat.service';
import { NewsService } from '../../Serives/News/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeSection = 'banner';
  indicatorPosition = 0;
  sections = ['banner', 'about', 'planning', 'location', 'contact'];
  scrollProgress = 0;
  
  constructor(private chat: ChatService, private news: NewsService) { }
  
  ngOnInit() {
    this.checkCurrentSection();
  }

  scrollToSection(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  checkCurrentSection(): void {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      let windowHeight = window.innerHeight;
      const scrolled = window.scrollY;
      
      this.sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            this.activeSection = section;
            this.updateIndicatorPosition();
          }
        }
      });
      
      this.scrollProgress = (scrolled / windowHeight) * 100;
    });
  }

  updateIndicatorPosition(): void {
    const index = this.sections.indexOf(this.activeSection);
    this.indicatorPosition = index * 50; // 50px height per item
  }
}
