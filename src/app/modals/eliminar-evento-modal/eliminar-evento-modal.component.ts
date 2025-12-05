import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-eliminar-evento-modal',
  templateUrl: './eliminar-evento-modal.component.html',
  styleUrls: ['./eliminar-evento-modal.component.scss'],
})
export class EliminarEventoModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventosService: EventosAcademicosService,
    public dialogRef: MatDialogRef<EliminarEventoModalComponent>
  ) {}

  public cerrarDialogo(): void {
    this.dialogRef.close({ isDelete: false });
  }

  public eliminarEvento(): void {
    this.eventosService.eliminarEvento(this.data.id).subscribe(
      (response) => {
        console.log('Evento eliminado:', response);
        this.dialogRef.close({ isDelete: true }); // Éxito
      },
      (error) => {
        console.error('Error al eliminar evento:', error);
        // Mostrar error al usuario dentro del modal (o antes de cerrar)
        alert('Error al conectar con la API para eliminar el evento.');
        this.dialogRef.close({ isDelete: false, error: true }); // Falla, opcionalmente con un flag de error
      }
    );
  }
}
