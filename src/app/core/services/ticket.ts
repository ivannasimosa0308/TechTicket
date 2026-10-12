import { Injectable, signal, computed, inject } from '@angular/core'; //importamos las señales de tipo signal clasica y compute
import { HttpClient } from '@angular/common/http';//importamos el cliente http para hacer peticiones a la api

export interface Ticket { //definimos los atributos de la clase Ticket
    id: number;
    title: string;
    completed: boolean;
}
interface TicketState { //definimos los atributos de la clase TicketState
    data: Ticket[];
    loading: boolean;
    error: string | null;
}
@Injectable({ providedIn: 'root' })
export class TicketService { //clase que implementa el servicio de tickets
    private http = inject(HttpClient); //inyectamos el cliente http en la clase TicketService
    private state = signal<TicketState>({//definimos el estado inicial de la clase TicketState, el estado es privado y modificable solo desde la clase TicketService, el estado es de tipo TicketState


        data: [],
        loading: false,
        error: null
    });


    //informacion que se va a exponer a los componentes que consuman este servicio

    public tickets = computed(() => this.state().data);
    public isLoading = computed(() => this.state().loading);
    public errorMessage = computed(() => this.state().error);

    public fetchTickets(): void { //metodo que hace la peticion a la api para obtener los tickets

        console.log('se entra en fetchtickets')
        //mutacion inicial: se activa el indicador de carga 
        this.state.update((state) => ({ ...state, loading: true, error: null }));

        this.http.get<Ticket[]>('https://jsonplaceholder.typicode.com/todos?_limit=15') //hacemos la peticion a la api, con un limite de 15 tickets
            //el signo de interrogacion despues de todos es lo que indica l inicio de los parametros de consulta. 
            .subscribe({
                next: (response) => {
                    this.state.update(estadoActual => ({ ...estadoActual, data: response, loading: false, error: null })); //mutacion final: se actualiza el estado con los datos obtenidos de la api y se desactiva el indicador de carga
                },
                error: () => {
                    this.state.update(estadoActual => ({ ...estadoActual, loading: false, error: 'Error de red al contactar con el servidor. Revise su conexión' })); //mutacion final: se actualiza el estado con el mensaje de error y se desactiva el indicador de carga
                }
                //los tres puntos antes de estadoActual es el operador de propagacion, que permite copiar todas las propiedades del objeto estadoActual en el nuevo objeto que se esta creando.
                // Esto es necesario porque si no se hace, se perderian las propiedades que no se estan actualizando en la mutacion.
            });
    }
}
