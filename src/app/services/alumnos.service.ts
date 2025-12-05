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
export class AlumnosService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaAlumno() {
    return {
      rol: '',
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: '',
      telefono: '',
      ocupacion: '',
    };
  }

  /**
   * Validación para el formulario de alumno.
   */
  public validarAlumno(data: any, editar: boolean) {
    let error: any = {};

    // Validaciones
    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data['curp'])) {
      error['curp'] = this.errorService.required;
    } else if (!this.validatorService.min(data['curp'], 18)) {
      error['curp'] = this.errorService.min(18);
      alert('La longitud de caracteres del CURP es menor, deben ser 18');
    } else if (!this.validatorService.max(data['curp'], 18)) {
      error['curp'] = this.errorService.max(18);
      alert('La longitud de caracteres del CURP es mayor, deben ser 18');
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud de caracteres del RFC es menor, deben ser 12');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud de caracteres del RFC es mayor, deben ser 13');
    }

    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      alert('El formato es solo números');
    } else if (data['edad'] < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18';
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }

  /**
   * Servicio para registrar un nuevo alumno.
   * No requiere autenticación (registro público).
   */
  public registrarAlumno(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${environment.url_api}/alumnos/`, data, {
      headers,
    });
  }

  /**
   * Petición para obtener la lista de alumnos.
   * Requiere autenticación.
   */
  public obtenerListaAlumnos(): Observable<any> {
    // 1. Obtener el token
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert(
        'ERROR: No hay token de autenticación. Por favor, inicia sesión nuevamente.'
      );
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    // 2. Crear headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    // 3. URL completa
    const url = `${environment.url_api}/lista-alumnos/`;

    // 4. Hacer la petición
    return this.http.get<any>(url, { headers }).pipe(
      tap((response) => {}),
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
   * Petición para obtener un alumno por su ID.
   * Requiere autenticación.
   */
  public obtenerAlumnoPorID(idAlumno: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    });

    const url = `${environment.url_api}/alumnos/?id=${idAlumno}`;

    return this.http.get<any>(url, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Servicio para actualizar un alumno.
   * Requiere autenticación.
   */
  public actualizarAlumno(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    });

    return this.http
      .put<any>(`${environment.url_api}/alumnos/`, data, {
        headers,
      })
      .pipe(
        tap((response) => {}),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Petición para eliminar un alumno.
   * Requiere autenticación.
   */
  public eliminarAlumno(idAlumno: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token || token === '') {
      alert('ERROR: No hay token de autenticación.');
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    });

    return this.http
      .delete<any>(`${environment.url_api}/alumnos/?id=${idAlumno}`, {
        headers,
      })
      .pipe(
        tap((response) => {}),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
