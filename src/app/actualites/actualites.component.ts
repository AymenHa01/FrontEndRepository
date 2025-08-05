import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../Serives/News/news.service';

@Component({
  selector: 'app-actualites',
  templateUrl: './actualites.component.html',
  styleUrls: ['./actualites.component.css']
})
export class ActualitesComponent implements OnInit {

  constructor(private news: NewsService) { }

  ngOnInit(): void {
    // Load news data
    this.news.generateNewsFromLatest().then((response) => {
      console.log(response);
    });
  }
} 