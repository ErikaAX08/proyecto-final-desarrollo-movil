import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-evento',
  templateUrl: './registro-evento.component.html',
  styleUrls: ['./registro-evento.component.scss'],
})
export class RegistroEventoComponent implements OnInit {
  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idEvento: number = 0;
  public minDate: Date = new Date();

  // Variables para público objetivo
  public publicoObjetivo: any = {
    estudiantes: false,
    profesores: false,
    publicoGeneral: false,
  };
  public mostrarProgramaEducativo: boolean = false;

  // Lista de responsables (maestros y administradores)
  public listaResponsables: any[] = [];

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private eventosService: EventosAcademicosService,
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario sea administrador
    const rol = this.facadeService.getUserGroup();
    if (rol !== 'administrador') {
      alert('No tienes permisos para registrar eventos académicos.');
      this.router.navigate(['/home']);
      return;
    }

    // Inicializar el esquema del evento
    this.evento = this.eventosService.esquemaEvento();

    // Cargar la lista de responsables
    this.cargarResponsables();

    // Verificar si estamos en modo edición
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log('ID Evento a editar: ', this.idEvento);
      this.obtenerEventoPorID();
    }
  }

  /**
   * Cargar la lista de maestros y administradores para el select de responsable
   */
  public cargarResponsables() {
    // Cargar administradores
    this.administradoresService.obtenerListaAdmins().subscribe(
      (responseAdmins) => {
        responseAdmins.forEach((admin: any) => {
          this.listaResponsables.push({
            id: admin.user.id,
            nombre_completo: `${admin.user.first_name} ${admin.user.last_name} (Admin)`,
            tipo: 'administrador',
          });
        });

        // Cargar maestros
        this.maestrosService.obtenerListaMaestros().subscribe(
          (responseMaestros) => {
            responseMaestros.forEach((maestro: any) => {
              this.listaResponsables.push({
                id: maestro.user.id,
                nombre_completo: `${maestro.user.first_name} ${maestro.user.last_name} (Maestro)`,
                tipo: 'maestro',
              });
            });

            console.log(
              'Lista de responsables cargada:',
              this.listaResponsables
            );
          },
          (error) => {
            console.error('Error al cargar maestros:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar administradores:', error);
      }
    );
  }

  /**
   * Maneja el cambio en los checkboxes de público objetivo
   */
  public onPublicoObjetivoChange() {
    // Construir el array de público objetivo
    this.evento.publico_objetivo = [];

    if (this.publicoObjetivo.estudiantes) {
      this.evento.publico_objetivo.push('Estudiantes');
      this.mostrarProgramaEducativo = true;
    } else {
      this.mostrarProgramaEducativo = false;
      this.evento.programa_educativo = ''; // Limpiar el programa educativo
    }

    if (this.publicoObjetivo.profesores) {
      this.evento.publico_objetivo.push('Profesores');
    }

    if (this.publicoObjetivo.publicoGeneral) {
      this.evento.publico_objetivo.push('Público general');
    }

    console.log('Público objetivo actualizado:', this.evento.publico_objetivo);
  }

  /**
   * Función para registrar un nuevo evento
   */
  public registrar() {
    // Limpiar errores previos
    this.errors = {};

    // Validar el formulario
    this.errors = this.eventosService.validarEvento(this.evento, false);

    // Si no hay errores, proceder con el registro
    if (Object.keys(this.errors).length === 0) {
      // 1. Crear una copia de los datos para la modificación del formato
      let eventoData = { ...this.evento };

      // 2. Formatear la fecha a YYYY-MM-DD (Formato esperado por el backend)
      if (eventoData.fecha_realizacion instanceof Date) {
        eventoData.fecha_realizacion = this.eventosService.formatDate(
          eventoData.fecha_realizacion
        );
      }

      // 3. Serializar el público objetivo
      eventoData.publico_objetivo = JSON.stringify(
        this.evento.publico_objetivo
      );

      // 4. Asegurar que programa_educativo sea una cadena vacía si no aplica
      if (!this.mostrarProgramaEducativo) {
        eventoData.programa_educativo = '';
      }

      console.log('Datos a enviar:', eventoData);

      this.eventosService.registrarEvento(eventoData).subscribe(
        (response) => {
          console.log('Evento registrado exitosamente:', response);
          alert('Evento registrado correctamente.');
          this.router.navigate(['/eventos-academicos']);
        },
        (error) => {
          console.error('Error al registrar evento:', error);
          alert('Error al registrar el evento. Por favor, intente nuevamente.');
        }
      );
    } else {
      console.log('Errores de validación:', this.errors);
      alert('Por favor, corrija los errores en el formulario.');
    }
  }

  /**
   * Obtener evento por ID para edición
   */
  public obtenerEventoPorID() {
    this.eventosService.obtenerEventoPorID(this.idEvento).subscribe(
      (response) => {
        console.log('Evento obtenido:', response);
        this.evento = response;

        // Parsear el público objetivo
        if (typeof this.evento.publico_objetivo === 'string') {
          this.evento.publico_objetivo = JSON.parse(
            this.evento.publico_objetivo
          );
        }

        // Configurar los checkboxes de público objetivo
        this.publicoObjetivo.estudiantes =
          this.evento.publico_objetivo.includes('Estudiantes');
        this.publicoObjetivo.profesores =
          this.evento.publico_objetivo.includes('Profesores');
        this.publicoObjetivo.publicoGeneral =
          this.evento.publico_objetivo.includes('Público general');

        // Mostrar programa educativo si aplica
        this.mostrarProgramaEducativo = this.publicoObjetivo.estudiantes;

        // Convertir la fecha al formato correcto para el datepicker
        if (this.evento.fecha_realizacion) {
          this.evento.fecha_realizacion = new Date(
            this.evento.fecha_realizacion
          );
        }
      },
      (error) => {
        console.error('Error al obtener evento:', error);
        alert('No se pudo obtener el evento seleccionado.');
      }
    );
  }

  /**
   * Función para actualizar un evento existente
   */
  public actualizar() {
    // Limpiar errores previos
    this.errors = {};

    // Validar el formulario
    this.errors = this.eventosService.validarEvento(this.evento, true);

    // Si no hay errores, proceder con la actualización
    if (Object.keys(this.errors).length === 0) {
      // Confirmar la actualización con un modal
      const confirmacion = confirm(
        '¿Está seguro de que desea actualizar este evento?'
      );

      if (confirmacion) {
        // 1. Crear una copia de los datos
        let eventoData = { ...this.evento, id: this.idEvento };

        // 2. Formatear la fecha a YYYY-MM-DD
        if (eventoData.fecha_realizacion instanceof Date) {
          eventoData.fecha_realizacion = this.eventosService.formatDate(
            eventoData.fecha_realizacion
          );
        }

        // 3. Serializar el público objetivo
        eventoData.publico_objetivo = JSON.stringify(
          this.evento.publico_objetivo
        );

        // 4. Asegurar que programa_educativo sea una cadena vacía si no aplica
        if (!this.mostrarProgramaEducativo) {
          eventoData.programa_educativo = '';
        }

        console.log('Datos a actualizar:', eventoData);

        this.eventosService.actualizarEvento(eventoData).subscribe(
          (response) => {
            console.log('Evento actualizado exitosamente:', response);
            alert('Evento actualizado correctamente.');
            this.router.navigate(['/eventos-academicos']);
          },
          (error) => {
            console.error('Error al actualizar evento:', error);
            alert(
              'Error al actualizar el evento. Por favor, intente nuevamente.'
            );
          }
        );
      }
    } else {
      console.log('Errores de validación:', this.errors);
      alert('Por favor, corrija los errores en el formulario.');
    }
  }

  /**
   * Función para regresar a la pantalla anterior
   */
  public goBack() {
    this.location.back();
  }
}
