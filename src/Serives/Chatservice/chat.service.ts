// chat.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AtelierServiceService } from '../atelier-service.service';
import { EvenemtsService } from '../evenemts.service';
import { FormationService } from '../formation.service';
import { Router, NavigationExtras } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { ApiUtilService } from '../api-util.service';

// Define chat message interface
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// Interface for navigation data
interface NavigationData {
  type: 'formation' | 'evenement' | 'atelier';
  query: string;
  itemId?: string | number;
  isSpecific: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  info: string = "";
  
  // Chat history
  private conversationHistory: ChatMessage[] = [];
  private historySubject = new Subject<ChatMessage[]>();
  public history$ = this.historySubject.asObservable();
  
  // Navigation data
  private navigationDataSubject = new Subject<NavigationData>();
  public navigationData$ = this.navigationDataSubject.asObservable();
  
  constructor(
    private atelier: AtelierServiceService,
    private ennement: EvenemtsService,
    private formation: FormationService, 
    private router: Router,
    private apiUtil: ApiUtilService
  ) {}

  async sendMessage(message: string): Promise<string> {
    // Add user message to history
    this.addToHistory('user', message);
    
    try {
      console.log(message);
      
      // First identify the category
      const category = await this.identifyCategory(message);
      console.log("Category identified:", category);
      
      // For unknown categories, provide helpful message and navigate to contact
      if (category === "4") {
        const notFoundMessage = "Je suis désolé, ce type d'information n'est pas enregistré dans notre base de données. Vous pouvez contacter l'administrateur pour obtenir de l'aide.";
        this.addToHistory('ai', notFoundMessage);
        // Navigate to contact page
        this.router.navigate(['/contact']);
        return notFoundMessage;
      }
      
      // Add navigation message BEFORE navigation happens
      const categoryType = this.getCategoryType(category);
      const frenchCategoryName = this.getFrenchCategoryName(category);
      const navMessage = `Je vous dirige vers la page de ${frenchCategoryName}...`;
      this.addToHistory('ai', navMessage);
      
      // For known categories, get the information and check if asking about specific item
      const specificItemCheck = await this.checkIfSpecificItem(message, category);
      const isSpecificItem = specificItemCheck.isSpecific;
      
      // Get the information based on category
      this.info = await this.Informations(message, category, isSpecificItem);
      console.log(this.info);
      
      // If the info is 'unknown category' (shouldn't happen after our category check, but just in case)
      if (this.info === 'unknown category') {
        const notFoundMessage = "Je suis désolé, ce type d'information n'est pas enregistré dans notre base de données. Vous pouvez contacter l'administrateur pour obtenir de l'aide.";
        this.addToHistory('ai', notFoundMessage);
        // Navigate to contact page
        this.router.navigate(['/contact']);
        return notFoundMessage;
      }
      
      const data = JSON.parse(this.info);
      
      // Create a prompt that includes conversation history for context
      const historyContext = this.getFormattedHistory();
      const prompt = `
        Based on the following conversation history:
        ${historyContext}
        
        The user query: "${message}"
        
        Given the following data, please return a short, concise, and user-friendly response in French. The response should be no more than 3-4 sentences, providing key details in a natural and brief way.
        
        Data: ${JSON.stringify(data)}
        
        Make sure the response is in French (the user's language), and adapt it accordingly (formation, événement, atelier, etc.). For example, "Cet événement aura lieu le [date] à [lieu], et le présentateur est [nom]." Keep it simple and direct.

        ${isSpecificItem ? 
          `Also include the ID of the specific item from the data that best matches the user's query. Format your response like this: "RESPONSE_TEXT||ITEM_ID" where ITEM_ID is the id field of the most relevant item.` : 
          'No need to include an item ID in your response.'}
      `;
    
      // Send the prompt to Groq
      const apiKey = environment.groqApiKey;
      const response = await this.apiUtil.sendMessageToGroq(prompt, apiKey);
      
      // Check if response contains an item ID for specific items
      let cleanResponse = response;
      let itemId: string | undefined = undefined;
      if (isSpecificItem && response.includes("||")) {
        const parts = response.split("||");
        cleanResponse = parts[0].trim();
        itemId = parts[1].trim();
      }
      
      // Add AI response to history
      this.addToHistory('ai', cleanResponse);
      
      // Add "this is the page you need" message in French
      let arrivalMessage;
      if (isSpecificItem && itemId) {
        arrivalMessage = `Voici la page de ${frenchCategoryName} que vous cherchez. J'ai mis en évidence l'information spécifique qui vous intéresse.`;
      } else {
        arrivalMessage = `Voici la page de ${frenchCategoryName} que vous cherchez.`;
      }
      this.addToHistory('ai', arrivalMessage);
      
      // Emit navigation data for the receiving component
      this.navigationDataSubject.next({
        type: categoryType as any,
        query: message,
        itemId: itemId,
        isSpecific: isSpecificItem
      });
    
      return cleanResponse;
    } catch (error) {
      console.error('Error sending message to Groq:', error);
      const errorMessage = "Je suis désolé, il y a eu un problème lors du traitement de votre demande. Veuillez réessayer plus tard.";
      this.addToHistory('ai', errorMessage);
      return errorMessage;
    }
  }
  
  // Check if the user is asking about a specific item rather than general category
  private async checkIfSpecificItem(message: string, category: string): Promise<{isSpecific: boolean, possibleId?: string}> {
    const categoryType = this.getCategoryType(category);
    const prompt = `
      Analyze this message: "${message}"
      
      Is the user asking about:
      1. A general category of ${categoryType} (just asking for all ${categoryType}s)
      2. A specific ${categoryType} (asking for details about one particular ${categoryType})
      
      Return ONLY "general" or "specific".
    `;
    
    try {
      const apiKey = environment.groqApiKey;
      const response = await this.apiUtil.sendMessageToGroq(prompt, apiKey);
      const isSpecific = response.trim().toLowerCase().includes('specific');
      return { isSpecific };
    } catch (error) {
      console.error('Error checking if specific item:', error);
      return { isSpecific: false };
    }
  }
  
  // Helper to convert category number to type string
  private getCategoryType(category: string): string {
    switch (category) {
      case "1": return "formation";
      case "2": return "evenement";
      case "3": return "atelier";
      default: return "unknown";
    }
  }
  
  // Helper to get French category name
  private getFrenchCategoryName(category: string): string {
    switch (category) {
      case "1": return "formation";
      case "2": return "événement";
      case "3": return "atelier";
      default: return "inconnu";
    }
  }
    
  async identifyCategory(message: string): Promise<string> {
    const prompt = `Please analyze the following message and return one of the following values:
    1 if the message is asking for information about "formation" (training or courses).
    "2" if the message is asking for information about "evenement" (events).
    3 if the message is asking for information about "atelier" (workshops or seminars).
    4 if the message does not relate to any of these topics (unknown category).
      just return the value nothing else 
    Message: "${message}"`;
    try {
      const apiKey = environment.groqApiKey;
      const response = await this.apiUtil.sendMessageToGroq(prompt, apiKey);
      return response.trim();
    } catch (error) {
      console.error('Error sending message to Groq:', error);
      return "4"; // Default to unknown category on error
    }
  }

  // Modified to accept category if already identified and whether it's a specific item
  Informations(message: string, preIdentifiedCategory?: string, isSpecificItem: boolean = false): Promise<string> {
    const categoryPromise = preIdentifiedCategory ? 
      Promise.resolve(preIdentifiedCategory) : 
      this.identifyCategory(message);
      
    return categoryPromise.then((category) => {
      return new Promise<string>((resolve, reject) => {
        // Create navigation extras with query params
        const navigationExtras: NavigationExtras = {
          queryParams: {
            query: encodeURIComponent(message),
            highlight: 'true',
            specific: isSpecificItem ? 'true' : 'false'
          }
        };
        
        switch (category) {
          case "1": // Formation
            this.formation.getFormations().subscribe(
              (data) => {
                console.log(data);
                // Navigate to formation page with query parameters
                this.router.navigate(['/formation'], navigationExtras);
                resolve(JSON.stringify(data)); 
              },
              (error) => {
                console.error('Error fetching formations:', error);
                reject('Error fetching formations');
              }
            );
            break;
  
          case "2": // Evenement
            this.ennement.getAllEvents().subscribe(
              (data) => {
                console.log(data);
                // Navigate to evenement page with query parameters
                this.router.navigate(['/allevenement'], navigationExtras);
                resolve(JSON.stringify(data));
              },
              (error) => {
                console.error('Error fetching evenements:', error);
                reject('Error fetching evenements');
              }
            );
            break;
  
          case "3": // Atelier
            this.atelier.GetAllAtelier().subscribe(
              (data) => {
                console.log(data);
                // Navigate to atelier page with query parameters
                this.router.navigate(['/atelier'], navigationExtras);
                resolve(JSON.stringify(data));
              },
              (error) => {
                console.error('Error fetching ateliers:', error);
                reject('Error fetching ateliers');
              }
            );
            break;
  
          case "4": // Unknown category
            resolve('unknown category');
            break;
  
          default:
            resolve('unknown category');
            break;
        }
      });
    });
  }
  
  // Chat history management methods
  private addToHistory(sender: 'user' | 'ai', text: string): void {
    const message: ChatMessage = { sender, text, timestamp: new Date() };
    this.conversationHistory.push(message);
    
    // Limit history size if needed (optional)
    const maxHistoryLength = 50;
    if (this.conversationHistory.length > maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-maxHistoryLength);
    }
    
    this.historySubject.next([...this.conversationHistory]);
  }
  
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]; // Return a copy
  }
  
  clearHistory(): void {
    this.conversationHistory = [];
    this.historySubject.next([]);
  }
  
  // Helper to format history for the AI prompt
  private getFormattedHistory(): string {
    // Format the last few messages for context
    return this.conversationHistory
      .slice(-5) // Only include the last 5 messages for context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n');
  }
}
