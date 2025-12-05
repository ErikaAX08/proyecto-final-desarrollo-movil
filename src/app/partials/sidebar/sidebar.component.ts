import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  mobileOpen = false;
  isMobileView = window.innerWidth < 900;
  userRole: string = '';

  constructor(private router: Router, private facadeService: FacadeService) {}

  ngOnInit(): void {
    this.loadUserRole();
  }

  // Método para cargar y verificar el rol del usuario
  private loadUserRole(): void {
    this.userRole = this.facadeService.getUserGroup();

    // Si no hay rol, verificar si hay sesión
    if (!this.userRole || this.userRole === '') {
      console.warn('⚠️ No se encontró el rol del usuario');
      const token = this.facadeService.getSessionToken();

      if (token) {
        console.warn(
          '⚠️ Hay token pero no hay rol. Esto puede ser un problema en el login.'
        );
        console.log(
          '💡 Tip: Verifica que el backend esté enviando el campo "rol" en la respuesta del login'
        );
      } else {
        console.error('❌ No hay sesión activa, redirigiendo al login...');
        this.router.navigate(['/login']);
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 900;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    if (this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  logout() {
    console.log('🚪 Iniciando logout...');
    this.facadeService.logout().subscribe(
      (response) => {
        console.log('✅ Logout exitoso en el servidor:', response);
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      (error) => {
        console.error('❌ Error en logout del servidor:', error);
        // Fallback: clear local data and navigate anyway
        console.log('⚠️ Limpiando datos locales de todas formas...');
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Helper methods to check user roles
  isAdmin(): boolean {
    if (!this.userRole) {
      console.log('isAdmin(): No hay rol definido');
      return false;
    }

    // Normalizar el rol para evitar problemas con espacios o mayúsculas
    const normalizedRole = this.userRole.trim().toLowerCase();
    const isAdminRole =
      normalizedRole === 'administrador' || normalizedRole === 'admin';

    console.log(
      `isAdmin(): "${this.userRole}" (normalizado: "${normalizedRole}") -> ${isAdminRole}`
    );
    return isAdminRole;
  }

  isTeacher(): boolean {
    if (!this.userRole) {
      console.log('isTeacher(): No hay rol definido');
      return false;
    }

    // Normalizar el rol para evitar problemas con espacios o mayúsculas
    const normalizedRole = this.userRole.trim().toLowerCase();
    const isTeacherRole =
      normalizedRole === 'maestro' || normalizedRole === 'teacher';

    console.log(
      `isTeacher(): "${this.userRole}" (normalizado: "${normalizedRole}") -> ${isTeacherRole}`
    );
    return isTeacherRole;
  }

  isStudent(): boolean {
    if (!this.userRole) {
      console.log('isStudent(): No hay rol definido');
      return false;
    }

    // Normalizar el rol para evitar problemas con espacios o mayúsculas
    const normalizedRole = this.userRole.trim().toLowerCase();
    const isStudentRole =
      normalizedRole === 'alumno' || normalizedRole === 'student';

    console.log(
      `isStudent(): "${this.userRole}" (normalizado: "${normalizedRole}") -> ${isStudentRole}`
    );
    return isStudentRole;
  }

  // Check if user can see admin-only items
  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }

  // Check if user can see teacher-level items
  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  // Check if user can see all items (admin, teacher, student)
  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }

  // Check if user can see Inicio (admin and teacher only, not student)
  canSeeHomeItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }
}
