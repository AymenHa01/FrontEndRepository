import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../Serives/News/news.service';
    @Component({
  selector: 'app-actualiter',
  templateUrl: './actualiter.component.html',
  styleUrl: './actualiter.component.css'
})
export class ActualiterComponent  implements OnInit{
  News : any[]=[];
  constructor(private news: NewsService) { }

  ngOnInit(): void {
    // Load news data
    this.news.generateNewsFromLatest().then((response) => {
  
      this.News=JSON.parse(response);
      console.log(this.News);
    });
  }
}
