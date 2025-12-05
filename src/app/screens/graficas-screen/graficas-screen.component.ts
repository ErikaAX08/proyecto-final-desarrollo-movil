import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss'],
})
export class GraficasScreenComponent implements OnInit {
  // Agregar chartjs-plugin-datalabels

  // Variables de control de datos
  public total_user: any = {}; // Objeto que guarda la respuesta de la API

  // --- Gráficas de Eventos Académicos (Se mantienen estáticas por ahora) ---

  // Histograma (Línea)
  lineChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406',
      },
    ],
  };
  lineChartOption = { responsive: false };
  lineChartPlugins = [DatalabelsPlugin];

  // Barras
  barChartData = {
    labels: [
      'Congreso',
      'FePro',
      'Presentación Doctoral',
      'Feria Matemáticas',
      'T-System',
    ],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A',
        ],
      },
    ],
  };
  barChartOption = { responsive: false };
  barChartPlugins = [DatalabelsPlugin];

  // --- Gráficas de Usuarios (Se actualizan con la API) ---

  // Circular (Pie)
  pieChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0], // Valores iniciales
        label: 'Registro de usuarios',
        backgroundColor: ['#FCFF44', '#F1C8F2', '#31E731'],
      },
    ],
  };
  pieChartOption = { responsive: false };
  pieChartPlugins = [DatalabelsPlugin];

  // Doughnut (Dona)
  doughnutChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0], // Valores iniciales
        label: 'Registro de usuarios',
        backgroundColor: ['#F88406', '#FCFF44', '#31E7E7'],
      },
    ],
  };
  doughnutChartOption = { responsive: false };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(private administradoresServices: AdministradoresService) {}

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Función para obtener el total de usuarios registrados y actualizar las gráficas
  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response: any) => {
        this.total_user = response;
        console.log('Total usuarios: ', this.total_user);

        // Extraemos los totales de la respuesta del backend
        const totalAdmins = this.total_user.admins || 0;
        const totalMaestros = this.total_user.maestros || 0;
        const totalAlumnos = this.total_user.alumnos || 0;

        // Array de datos a inyectar en las gráficas
        const newUserData: number[] = [
          totalAdmins,
          totalMaestros,
          totalAlumnos,
        ];

        // 1. Actualizar la data de la gráfica Pie
        // Usamos spread operator para forzar a ng2-charts a detectar el cambio de la data
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [
            {
              ...this.pieChartData.datasets[0],
              data: newUserData,
            },
          ],
        };

        // 2. Actualizar la data de la gráfica Doughnut
        this.doughnutChartData = {
          ...this.doughnutChartData,
          datasets: [
            {
              ...this.doughnutChartData.datasets[0],
              data: newUserData,
            },
          ],
        };
      },
      (error) => {
        console.log('Error al obtener total de usuarios ', error);
        alert(
          'No se pudo obtener el total de cada rol de usuarios. Código: ' +
            error.status
        );
      }
    );
  }
}
