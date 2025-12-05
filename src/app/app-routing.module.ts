import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { RegistroEventoComponent } from './partials/registro-evento/registro-evento.component';
import { ListaEventosComponent } from './screens/eventos-screen/lista-eventos.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginScreenComponent },
      { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent },
      {
        path: 'registro-usuarios/:rol/:id',
        component: RegistroUsuariosScreenComponent,
      },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'home', component: HomeScreenComponent },
      { path: 'administrador', component: AdminScreenComponent }, // Keep legacy route
      { path: 'alumnos', component: AlumnosScreenComponent },
      { path: 'maestros', component: MaestrosScreenComponent },
      { path: 'graficas', component: GraficasScreenComponent },
      {
        path: 'registro-evento',
        component: RegistroEventoComponent,
      },
      {
        path: 'registro-evento/:id',
        component: RegistroEventoComponent,
      },
      {
        path: 'eventos-academicos',
        component: ListaEventosComponent,
      },
    ],
  },
  // fallback route
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
