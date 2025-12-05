import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable, throwError } from 'rxjs'; // Importar throwError
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdministradoresService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaAdmin() {
    return {
      rol: '',
      clave_admin: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      telefono: '',
      rfc: '',
      edad: '',
      ocupacion: '',
    };
  }

  /**
   * Validación para el formulario de administrador.
   */
  public validarAdmin(data: any, editar: boolean) {
    let error: any = {};

    // Validaciones
    if (!this.validatorService.required(data['clave_admin'])) {
      error['clave_admin'] = this.errorService.required;
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

    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }

  /**
   * Servicio para registrar un nuevo administrador.
   * No requiere autenticación (registro público).
   */
  public registrarAdmin(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${environment.url_api}/admin/`, data, {
      headers,
    });
  }

  /**
   * Petición para obtener la lista de administradores.
   * Requiere autenticación (Bearer Token).
   */
  public obtenerListaAdmins(): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token) {
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<any>(`${environment.url_api}/lista-admins/`, {
      headers,
    });
  }

  /**
   * Petición para obtener un administrador por su ID.
   * Requiere autenticación (Bearer Token).
   */
  public obtenerAdminPorID(idAdmin: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token) {
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<any>(`${environment.url_api}/admin/?id=${idAdmin}`, {
      headers,
    });
  }

  /**
   * Servicio para actualizar un administrador.
   * Requiere autenticación (Bearer Token).
   */
  public actualizarAdmin(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token) {
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http.put<any>(`${environment.url_api}/admin/`, data, {
      headers,
    });
  }

  /**
   * Petición para eliminar un administrador.
   * Requiere autenticación (Bearer Token).
   */
  public eliminarAdmin(idAdmin: number): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token) {
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http.delete<any>(
      `${environment.url_api}/admin/?id=${idAdmin}`,
      { headers }
    );
  }

  /**
   * Servicio para obtener el total de usuarios registrados por rol.
   * Requiere autenticación (Bearer Token).
   */
  public getTotalUsuarios(): Observable<any> {
    const token = this.facadeService.getSessionToken();

    if (!token) {
      return throwError(
        () => new Error('Se requiere autenticación para esta operación')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<any>(`${environment.url_api}/total-usuarios/`, {
      headers,
    });
  }
}
