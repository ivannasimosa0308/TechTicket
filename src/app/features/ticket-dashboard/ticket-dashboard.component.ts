import {
  Component, computed, inject, signal, OnInit,
  ChangeDetectionStrategy
 } from '@angular/core';
import { TicketService } from '../../core/services/ticket';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonSpinner, IonSegment, IonSegmentButton, IonButton, IonText, IonBadge
} from '@ionic/angular';

@Component({
  selector: 'app-ticket-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonSpinner, IonSegment, IonSegmentButton, IonButton, IonText, IonBadge],
})
  
export class TicketDashboardComponent  implements OnInit {
  public ticketService = inject(TicketService); //el componente solicita el servicio 

  public filtroActual = signal<'todos' | 'abiertos' | 'cerrados'>('todos'); //guarda el filtro en esta pantalla, comienza en todos 

  public ticketsFiltrados = computed(() => {
    const data = this.ticketService.tickets();
    const filtro = this.filtroActual();


    if (filtro === 'abiertos') {

      return data.filter(ticket => !ticket.completed) //devuelve los que completed sea false
    }
    
    if (filtro === 'cerrados') {
      return data.filter(ticket => ticket.completed) //los que completed sea true 
    }

    return data;

  });


  ngOnInit(): void  { //lo que sucede al iniciar el componente 
    
    console.log('se inicia el componente')
    this.cargarDatos();

  }

  public cargarDatos(): void { 

    console.log('se llama a cargar datosçç')
    this.ticketService.fetchTickets(); 

  } 

  public cambiarFiltro(
    event: CustomEvent<{value?: string | number}> 
  ): void{

    const valor = event.detail.value; 
  
    if (
      valor === 'todos' ||
      valor === 'abiertos' || 
      valor === 'cerrados'

    ) {
      
      this.filtroActual.set(valor);
    }

  }

}
