// Utilitaire pour gérer les appels API et remplacer require() côté navigateur
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUtilService {
  constructor(private http: HttpClient) {}

  // Remplace sendMessageToGroq pour fonctionner côté navigateur
  async sendMessageToGroq(message: string, apiKey: string): Promise<string> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          model: "llama-3.3-70b-versatile",
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response from AI.";
    } catch (error) {
      console.error("Error with Groq API:", error);
      return "Error occurred.";
    }
  }
}
