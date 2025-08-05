import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { ApiUtilService } from '../api-util.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = (window as any)["env"]?.API_NEWS_URL || '/api/news';  

  constructor(private http: HttpClient, private apiUtil: ApiUtilService) { }

  getLatestNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`)
      .pipe(
        catchError(error => {
          console.error('Error fetching latest news:', error);
          return throwError(() => new Error('Failed to fetch latest news'));
        })
      );
  }

  async generateNewsFromLatest(): Promise<string> {
    try {
      // Convert the Observable to a Promise
      const latestNews = await lastValueFrom(this.getLatestNews());
      
      // Convert response to JSON string for processing
      const newsJson = JSON.stringify(latestNews);

      // Pass JSON data to GenerateNews
      return await this.GenerateNews(newsJson);
    } catch (error) {
      console.error('Error generating news:', error);
      return 'An error occurred while generating the news.';
    }
  }

  async GenerateNews(message: string): Promise<string> {
    console.log('GenerateNews called with message:', message);
    const prompt = `
    Given the following JSON data from an API containing the latest updates on workshops (ateliers), events (evenements), trainings (formations), and paintings (tableaux),
     extract the most relevant new information and return at least four structured JSON objects.
     the news should from the json .
    Ensure the image is extracted directly from the JSON data. Do NOT suggest a generic image.
    The description and the title should be always in French and phrased in a promotional way.
    if the is no data dont return any news.
    **Expected JSON Format:**
    [
      {
        "title": "string",
        "image": "string",  // Extract this from the input JSON
        "description": "string"
      }, 
    
    ]
    
    Here is the input data:
    "${message}"
    
    Only return the expected JSON with no other text, and ensure the output starts with "[" and ends with "]".
    Nothing else.
`;


    try {
      const apiKey = environment.groqApiKey;
      const response = await this.apiUtil.sendMessageToGroq(prompt, apiKey);
      return response;
    } catch (error) {
      console.error('Error sending message to Groq:', error);
      return 'An error occurred while sending the message.';
    }
  }
}
