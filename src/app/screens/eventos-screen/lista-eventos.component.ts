import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { FacadeService } from 'src/app/services/facade.service';
// IMPORTACIONES DE MODALES (Asegúrate de que existan estas rutas)
import { EditarEventoModalComponent } from '../../modals/editar-evento-modal/editar-evento-modal.component';
import { EliminarEventoModalComponent } from '../../modals/eliminar-evento-modal/eliminar-evento-modal.component';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.scss'],
})
export class ListaEventosComponent implements OnInit {
  public name_user: string = '';
  public rol: string = '';
  public token: string = '';
  public lista_eventos: any[] = [];
  public isAdmin: boolean = false;
  public isTeacher: boolean = false;
  public isStudent: boolean = false;

  // Variables para la tabla de Angular Material
  public displayedColumns: string[] = [];
  public dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    private eventosService: EventosAcademicosService,
    private router: Router,
    public dialog: MatDialog // Inyección de MatDialog
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    if (this.token === '') {
      this.router.navigate(['/']);
      return;
    }

    // Determinar el rol del usuario
    this.determinarRol();

    // Configurar las columnas según el rol
    this.configurarColumnas();

    // Obtener los eventos
    this.obtenerEventos();
  }

  /**
   * Determina el rol del usuario
   */
  private determinarRol(): void {
    const rolNormalizado = this.rol.trim().toLowerCase();
    this.isAdmin =
      rolNormalizado === 'administrador' || rolNormalizado === 'admin';
    this.isTeacher =
      rolNormalizado === 'maestro' || rolNormalizado === 'teacher';
    this.isStudent =
      rolNormalizado === 'alumno' || rolNormalizado === 'student';

    console.log('Rol determinado:', {
      rol: this.rol,
      isAdmin: this.isAdmin,
      isTeacher: this.isTeacher,
      isStudent: this.isStudent,
    });
  }

  /**
   * Configura las columnas de la tabla según el rol del usuario
   */
  private configurarColumnas(): void {
    this.displayedColumns = [
      'nombre_evento',
      'tipo_evento',
      'fecha_realizacion',
      'horario',
      'lugar',
      'publico_objetivo',
      'cupo_maximo',
    ];

    // Solo el administrador ve las columnas de editar y eliminar
    if (this.isAdmin) {
      this.displayedColumns.push('editar');
      this.displayedColumns.push('eliminar');
    }
  }

  /**
   * Obtener lista de eventos según el rol
   */
  public obtenerEventos(): void {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        console.log('Lista de eventos obtenida:', response);

        // Filtrar eventos según el rol
        this.lista_eventos = this.filtrarEventosPorRol(response);

        // Configurar el dataSource para la tabla
        this.dataSource = new MatTableDataSource(this.lista_eventos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Configurar el filtro personalizado
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const nombreEvento = data.nombre_evento.toLowerCase();
          return nombreEvento.includes(filter);
        };

        console.log('Eventos filtrados por rol:', this.lista_eventos);
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
        alert('No se pudo obtener la lista de eventos');
      }
    );
  }

  /**
   * Filtra los eventos según el rol del usuario
   */
  private filtrarEventosPorRol(eventos: any[]): any[] {
    if (this.isAdmin) {
      // El administrador ve todos los eventos
      return eventos;
    } else if (this.isTeacher) {
      // El maestro ve eventos para profesores y público general
      return eventos.filter((evento: any) => {
        const publicoObjetivo = this.parsePublicoObjetivo(
          evento.publico_objetivo
        );
        return (
          publicoObjetivo.includes('Profesores') ||
          publicoObjetivo.includes('Público general')
        );
      });
    } else if (this.isStudent) {
      // El alumno ve eventos para estudiantes y público general
      return eventos.filter((evento: any) => {
        const publicoObjetivo = this.parsePublicoObjetivo(
          evento.publico_objetivo
        );
        return (
          publicoObjetivo.includes('Estudiantes') ||
          publicoObjetivo.includes('Público general')
        );
      });
    }

    return [];
  }

  /**
   * Parsea el público objetivo (puede ser string JSON o array)
   */
  public parsePublicoObjetivo(publico: any): string[] {
    if (typeof publico === 'string') {
      try {
        return JSON.parse(publico);
      } catch (e) {
        return [publico];
      }
    }
    return Array.isArray(publico) ? publico : [];
  }

  /**
   * Aplica el filtro de búsqueda
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Navega al formulario de registro
   */
  public goRegistrar(): void {
    if (this.isAdmin) {
      this.router.navigate(['/registro-evento']);
    } else {
      alert('No tienes permisos para registrar eventos.');
    }
  }

  /**
   * Abre el modal de edición y navega al formulario de registro si se confirma.
   * @param idEvento ID del evento a editar.
   */
  public goEditar(idEvento: number): void {
    if (!this.isAdmin) {
      alert('No tienes permisos para editar eventos.');
      return;
    }

    // *** USO DEL MODAL DE EDICIÓN ***
    const dialogRef = this.dialog.open(EditarEventoModalComponent, {
      width: '350px',
      data: { id: idEvento },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // result es { confirm: true } si el usuario hizo clic en 'Editar'
      if (result && result.confirm) {
        this.router.navigate(['/registro-evento', idEvento]);
      }
    });
  }

  /**
   * Abre el modal de eliminación.
   * @param idEvento ID del evento a eliminar.
   */
  public eliminar(idEvento: number): void {
    if (!this.isAdmin) {
      alert('No tienes permisos para eliminar eventos.');
      return;
    }

    // *** USO DEL MODAL DE ELIMINACIÓN ***
    const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
      width: '400px',
      data: { id: idEvento }, // Pasar el ID del evento al modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      // result es { isDelete: true } si el evento se eliminó exitosamente en el modal.
      if (result && result.isDelete) {
        alert('Evento eliminado correctamente.');
        this.obtenerEventos(); // Recargar la lista
      } else if (result && result.error) {
        // En caso de que el modal devuelva un error explícito de la API
        alert('Hubo un error al intentar eliminar el evento.');
      }
    });
  }
}
