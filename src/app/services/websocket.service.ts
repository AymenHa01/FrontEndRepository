import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, Message, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AtelierServiceService } from '../../Serives/atelier-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private atelierSubject: Subject<any> = new Subject<any>();
  private sousAtelierSubject: Subject<any> = new Subject<any>();
  private formationSubject: Subject<any> = new Subject<any>();
  private galerieSubject: Subject<any> = new Subject<any>();
  private messageSubject: Subject<any> = new Subject<any>();
  private eventSubject: Subject<any> = new Subject<any>();

  constructor(private atelierService: AtelierServiceService) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const wsUrl = (window as any)["env"]?.WEBSOCKET_URL || environment.websocketUrl;
    const socket = new SockJS(wsUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str)
    });

    this.stompClient.onConnect = (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/atelier', (message: Message) => {
        this.atelierSubject.next(JSON.parse(message.body));
      });
      this.stompClient.subscribe('/topic/sous-atelier', (message: Message) => {
        this.sousAtelierSubject.next(JSON.parse(message.body));
      });
      this.stompClient.subscribe('/topic/formation', (message: Message) => {
        this.formationSubject.next(JSON.parse(message.body)  );
      });
      this.stompClient.subscribe('/topic/galerie', (message: Message) => {
        this.galerieSubject.next("");
      });
      this.stompClient.subscribe('/topic/events', (message: Message) => {
        this.eventSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (error: any) => {
      console.error('STOMP error', error);
    };

    this.stompClient.activate();
  }

  getAtelier(): Observable<any> {
    return this.atelierSubject.asObservable();
  }

  getSousAtelier(): Observable<any> {
    return this.sousAtelierSubject.asObservable();
  }

  getFormation(): Observable<any> {
    return this.formationSubject.asObservable();
  }

  getGalerie(): Observable<any> {
    return this.galerieSubject.asObservable();
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getEvents(): Observable<any> {
    return this.eventSubject.asObservable();
  }

  sendMessage(message: any, topic: string) {
    this.stompClient.publish({
      destination: topic,
      body: JSON.stringify(message)
    });
  }
}
