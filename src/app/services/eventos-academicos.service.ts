import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventosAcademicosService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  /**
   * Convierte un objeto Date a una cadena YYYY-MM-DD.
   * @param date Objeto Date
   * @returns Cadena de fecha YYYY-MM-DD
   */
  public formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public esquemaEvento() {
    return {
      nombre_evento: '',
      tipo_evento: '',
      fecha_realizacion: '',
      hora_inicio: '',
      hora_fin: '',
      lugar: '',
      publico_objetivo: [],
      programa_educativo: '',
      responsable_evento_id: '',
      descripcion_breve: '',
      cupo_maximo: '',
    };
  }

  /**
   * Validación para el formulario de evento académico.
   */
  public validarEvento(data: any, editar: boolean) {
    let error: any = {};

    // Validación: Nombre del evento
    if (!this.validatorService.required(data['nombre_evento'])) {
      error['nombre_evento'] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data['nombre_evento'])) {
      error['nombre_evento'] = 'Solo se permiten letras, números y espacios';
    }

    // Validación: Tipo de evento
    if (!this.validatorService.required(data['tipo_evento'])) {
      error['tipo_evento'] = this.errorService.required;
    }

    // Validación: Fecha de realización
    if (!this.validatorService.required(data['fecha_realizacion'])) {
      error['fecha_realizacion'] = this.errorService.required;
    } else {
      // Validar que la fecha no sea anterior al día actual
      const fechaSeleccionada = new Date(data['fecha_realizacion']);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < fechaActual) {
        error['fecha_realizacion'] =
          'No se pueden seleccionar fechas anteriores al día actual';
      }
    }

    // Validación: Hora de inicio
    if (!this.validatorService.required(data['hora_inicio'])) {
      error['hora_inicio'] = this.errorService.required;
    }

    // Validación: Hora de fin
    if (!this.validatorService.required(data['hora_fin'])) {
      error['hora_fin'] = this.errorService.required;
    }

    // Validar que hora_inicio < hora_fin
    if (data['hora_inicio'] && data['hora_fin']) {
      if (data['hora_inicio'] >= data['hora_fin']) {
        error['hora_fin'] =
          'La hora de fin debe ser mayor que la hora de inicio';
      }
    }

    // Validación: Lugar
    if (!this.validatorService.required(data['lugar'])) {
      error['lugar'] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data['lugar'])) {
      error['lugar'] = 'Solo se permiten caracteres alfanuméricos y espacios';
    }

    // Validación: Público objetivo (debe seleccionar al menos uno)
    if (!data['publico_objetivo'] || data['publico_objetivo'].length === 0) {
      error['publico_objetivo'] =
        'Debe seleccionar al menos un público objetivo';
    }

    // Validación: Programa educativo (solo si público objetivo incluye "Estudiantes")
    if (
      data['publico_objetivo'] &&
      data['publico_objetivo'].includes('Estudiantes')
    ) {
      if (!this.validatorService.required(data['programa_educativo'])) {
        error['programa_educativo'] =
          'Debe seleccionar un programa educativo cuando el público objetivo es Estudiantes';
      }
    }

    // Validación: Responsable del evento
    if (!this.validatorService.required(data['responsable_evento_id'])) {
      error['responsable_evento_id'] = this.errorService.required;
    }

    // Validación: Descripción breve
    if (!this.validatorService.required(data['descripcion_breve'])) {
      error['descripcion_breve'] = this.errorService.required;
    } else if (data['descripcion_breve'].length > 300) {
      error['descripcion_breve'] =
        'La descripción debe tener máximo 300 caracteres';
    } else if (
      !/^[a-zA-Z0-9\s.,;:()!?¿¡\-]+$/.test(data['descripcion_breve'])
    ) {
      error['descripcion_breve'] =
        'Solo se permiten letras, números y signos de puntuación básicos';
    }

    // Validación: Cupo máximo
    if (!this.validatorService.required(data['cupo_maximo'])) {
      error['cupo_maximo'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['cupo_maximo'])) {
      error['cupo_maximo'] = 'Solo se permiten números enteros positivos';
    } else if (
      parseInt(data['cupo_maximo']) <= 0 ||
      data['cupo_maximo'].length > 3
    ) {
      error['cupo_maximo'] =
        'El cupo debe ser un número positivo de máximo 3 dígitos';
    }

    return error;
  }

  /**
   * Servicio para registrar un nuevo evento académico.
   * Requiere autenticación (solo administradores).
   */
  public registrarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .post<any>(`${environment.url_api}/eventos-academicos/`, data, {
        headers,
      })
      .pipe(
        tap((response) => {
          console.log('Evento registrado exitosamente:', response);
        }),
        catchError((error) => {
          console.error('Error al registrar evento:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Petición para obtener la lista de eventos académicos.
   * Requiere autenticación.
   */
  public obtenerListaEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    const url = `${environment.url_api}/lista-eventos/`;

    return this.http.get<any>(url, { headers }).pipe(
      tap((response) => {
        console.log('Lista de eventos obtenida:', response);
      }),
      catchError((error) => {
        if (error.status === 403) {
          alert('ERROR 403: No tienes permisos. Verifica tu sesión.');
        } else if (error.status === 401) {
          alert(
            'ERROR 401: Tu sesión expiró. Por favor, inicia sesión nuevamente.'
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Petición para obtener un evento por su ID.
   * Requiere autenticación.
   */
  public obtenerEventoPorID(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    const url = `${environment.url_api}/eventos-academicos/?id=${idEvento}`;

    return this.http.get<any>(url, { headers }).pipe(
      tap((response) => {
        console.log('Evento obtenido:', response);
      }),
      catchError((error) => {
        console.error('Error al obtener evento:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Servicio para actualizar un evento académico.
   * Requiere autenticación (solo administradores).
   */
  public actualizarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .put<any>(`${environment.url_api}/eventos-academicos/`, data, {
        headers,
      })
      .pipe(
        tap((response) => {
          console.log('Evento actualizado exitosamente:', response);
        }),
        catchError((error) => {
          console.error('Error al actualizar evento:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Petición para eliminar un evento académico.
   * Requiere autenticación (solo administradores).
   */
  public eliminarEvento(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete<any>(
        `${environment.url_api}/eventos-academicos/?id=${idEvento}`,
        { headers }
      )
      .pipe(
        tap((response) => {
          console.log('Evento eliminado exitosamente:', response);
        }),
        catchError((error) => {
          console.error('Error al eliminar evento:', error);
          return throwError(() => error);
        })
      );
  }
}
