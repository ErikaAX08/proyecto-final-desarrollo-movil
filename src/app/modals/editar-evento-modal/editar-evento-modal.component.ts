import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-evento-modal',
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss'],
})
export class EditarEventoModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditarEventoModalComponent>
  ) {}

  public cerrarDialogo(): void {
    this.dialogRef.close({ confirm: false });
  }

  public confirmar(): void {
    // Aquí no se llama a ningún servicio, solo se confirma la acción.
    this.dialogRef.close({ confirm: true });
  }
}
