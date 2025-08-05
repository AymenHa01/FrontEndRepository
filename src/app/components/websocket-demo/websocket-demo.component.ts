import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-websocket-demo',
  template: `

  `,
  styles: [`
    .websocket-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .message-container {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .message {
      margin: 5px 0;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .input-container {
      display: flex;
      gap: 10px;
    }
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})

export class WebsocketDemoComponent  {
  // messages: string[] = [];
  // 

  // constructor(private webSocketService: WebSocketService) {}

  // ngOnInit() {
  //   this.subscription = this.webSocketService.getMessages().subscribe(
  //     (message) => {
  //       this.messages.push(message);
  //     }
  //   );
  // }

  // sendMessage(message: string) {
  //   if (message.trim()) {
  //     this.webSocketService.sendMessage(message);
  //   }
  // }

  // ngOnDestroy() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  //   this.webSocketService.closeConnection();
  // }
}
