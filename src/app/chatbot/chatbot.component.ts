import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatService } from '../../Serives/Chatservice/chat.service';

interface Message {
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ])
  ]
})
export class ChatbotComponent implements OnInit {
  isChatOpen = false;
  messages: Message[] = [];
  newMessage = '';
  isTyping = false;
  constructor(private chat : ChatService){}
  // Predefined responses for demo
  private botResponses = {
    greeting: ["Bonjour! Comment puis-je vous aider?", "Salut! Je suis là pour répondre à vos questions."],
    about: ["Nous sommes un espace culturel privé d'art, offrant des ateliers et des formations artistiques.", "Fortness de l'Art est un lieu dédié à l'expression artistique et à l'apprentissage."],
    location: ["Nous sommes situés à Monastir, Tunisie. Vous pouvez nous trouver à la Forteresse de la gravure.", "Venez nous rendre visite à la Forteresse de la gravure à Monastir!"],
    default: ["Je ne suis pas sûr de comprendre. Pouvez-vous reformuler?", "Désolé, je n'ai pas compris. Pouvez-vous être plus précis?"]
  };

 

  ngOnInit(): void {
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.addBotMessage(this.botResponses.greeting[0]);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    // Add user message
    this.messages.push({
      content: this.newMessage,
      type: 'user',
      timestamp: new Date()
    });

    // Store message and clear input
    const userMessage = this.newMessage.toLowerCase();
    this.newMessage = '';

    // Show typing indicator
    this.isTyping = true;

    // Simulate bot thinking and typing
    setTimeout(() => {
      this.isTyping = false;
      
      // Generate bot response based on keywords
   
      this.chat.sendMessage(userMessage).then((response) => {
        console.log(response);
          this.addBotMessage(response);
        });
    }, 1000);
  }

  private addBotMessage(content: string): void {
    this.messages.push({
      content: content,
      type: 'bot',
      timestamp: new Date()
    });
  }

  private getRandomResponse(responses: string[]): string {
    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  }
}
