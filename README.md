# 🎓 App Móvil Escolar - Frontend

Aplicación web desarrollada con **Angular 16** y **Angular Material** para el sistema de gestión escolar. Permite administrar usuarios (Administradores, Maestros y Alumnos) con operaciones CRUD completas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Pantallas de la Aplicación](#-pantallas-de-la-aplicación)
- [Servicios](#-servicios)

---

## ✨ Características

- ✅ **Autenticación** con manejo de tokens (cookies)
- ✅ **CRUD completo** para Administradores, Maestros y Alumnos
- ✅ **Tablas interactivas** con paginación, ordenamiento y filtrado
- ✅ **Formularios reactivos** con validación en tiempo real
- ✅ **Modales de confirmación** para eliminación de usuarios
- ✅ **Diseño responsivo** con Angular Material y Bootstrap
- ✅ **Gráficas estadísticas** con Chart.js
- ✅ **Navegación** con sidebar y rutas protegidas

---

## 🛠 Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 16.2.0 | Framework principal |
| Angular Material | 16.2.14 | Componentes UI |
| Bootstrap | 5.3.8 | Estilos CSS |
| Bootstrap Icons | 1.13.1 | Iconografía |
| ng2-charts | 4.1.1 | Gráficas |
| ngx-cookie-service | 16.1.0 | Manejo de cookies |
| ngx-mask | 16.4.2 | Máscaras de input |
| RxJS | 7.8.0 | Programación reactiva |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js 18.x o superior**
   ```bash
   node --version
   # Debe mostrar v18.x.x o superior
   ```

2. **npm 9.x o superior**
   ```bash
   npm --version
   ```

3. **Angular CLI 16.x**
   ```bash
   # Instalar globalmente
   npm install -g @angular/cli@16

   # Verificar instalación
   ng version
   ```

4. **Backend corriendo** en `http://127.0.0.1:8000`

---

## 🚀 Instalación

### Paso 1: Navegar al proyecto

```bash
cd Frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

> ⏳ Este proceso puede tomar varios minutos la primera vez.

### Paso 3: Verificar instalación

```bash
ng version
```

Deberías ver algo como:
```
Angular CLI: 16.2.11
Node: 18.x.x
Package Manager: npm 9.x.x
```

---

## ⚙️ Configuración del Entorno

### Archivo de Entorno de Desarrollo

El archivo `src/environments/environment.ts` contiene la configuración para desarrollo:

```typescript
export const environment = {
  production: false,
  url_api: 'http://127.0.0.1:8000'  // URL del backend
};
```

### Archivo de Entorno de Producción

El archivo `src/environments/environment.prod.ts` contiene la configuración para producción:

```typescript
export const environment = {
  production: true,
  url_api: 'https://tu-backend-produccion.com'  // Cambiar por URL real
};
```

---

## ▶️ Ejecución

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# O usando npm
npm start
```

La aplicación estará disponible en:
```
http://localhost:4200/
```

### Opciones adicionales

```bash
# Abrir automáticamente en el navegador
ng serve --open

# Especificar puerto diferente
ng serve --port 4300

# Permitir acceso desde red local
ng serve --host 0.0.0.0
```

### Compilar para Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en la carpeta `dist/`.

---

## 📁 Estructura del Proyecto

```
Frontend/
├── src/
│   ├── app/
│   │   ├── layouts/                    # Layouts de la aplicación
│   │   │   ├── auth-layout/            # Layout para login/registro
│   │   │   └── dashboard-layout/       # Layout principal con sidebar
│   │   │
│   │   ├── screens/                    # Pantallas principales
│   │   │   ├── login-screen/           # Pantalla de login
│   │   │   ├── home-screen/            # Dashboard principal
│   │   │   ├── admin-screen/           # Lista de administradores
│   │   │   ├── maestros-screen/        # Lista de maestros
│   │   │   ├── alumnos-screen/         # Lista de alumnos
│   │   │   ├── registro-usuarios-screen/ # Formulario registro/edición
│   │   │   └── graficas-screen/        # Gráficas estadísticas
│   │   │
│   │   ├── partials/                   # Componentes reutilizables
│   │   │   ├── navbar-user/            # Barra de navegación superior
│   │   │   ├── sidebar/                # Menú lateral
│   │   │   ├── registro-admin/         # Formulario de administrador
│   │   │   ├── registro-alumnos/       # Formulario de alumno
│   │   │   └── registro-maestros/      # Formulario de maestro
│   │   │
│   │   ├── modals/                     # Modales
│   │   │   └── eliminar-user-modal/    # Modal confirmación eliminar
│   │   │
│   │   ├── services/                   # Servicios HTTP
│   │   │   ├── facade.service.ts       # Servicio principal (auth, cookies)
│   │   │   ├── administradores.service.ts
│   │   │   ├── maestros.service.ts
│   │   │   ├── alumnos.service.ts
│   │   │   └── tools/                  # Utilidades
│   │   │       ├── validator.service.ts
│   │   │       └── errors.service.ts
│   │   │
│   │   ├── shared/                     # Utilidades compartidas
│   │   │   └── spanish-paginator-intl.ts
│   │   │
│   │   ├── app.module.ts               # Módulo principal
│   │   ├── app-routing.module.ts       # Configuración de rutas
│   │   └── app.component.ts
│   │
│   ├── assets/                         # Recursos estáticos
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── environments/                   # Configuración de entornos
│   │   ├── environment.ts              # Desarrollo
│   │   └── environment.prod.ts         # Producción
│   │
│   ├── styles.scss                     # Estilos globales
│   └── index.html
│
├── angular.json                        # Configuración Angular CLI
├── package.json                        # Dependencias
├── tsconfig.json                       # Configuración TypeScript
└── README.md
```

---

## 🎯 Funcionalidades Implementadas

### 🔐 Autenticación

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Login | ✅ | Inicio de sesión con email y contraseña |
| Logout | ✅ | Cierre de sesión y limpieza de cookies |
| Protección de rutas | ✅ | Redirección si no hay token |
| Manejo de tokens | ✅ | Almacenamiento seguro en cookies |

### 👨‍💼 Administradores

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Listar | ✅ | Tabla con todos los administradores |
| Crear | ✅ | Formulario de registro |
| Editar | ✅ | Formulario de edición con datos precargados |
| Eliminar | ✅ | Modal de confirmación + eliminación |
| Validación | ✅ | Validación de campos en formularios |

### 👨‍🏫 Maestros

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Listar | ✅ | Tabla con paginación, ordenamiento y filtro |
| Crear | ✅ | Formulario con selección de materias |
| Editar | ✅ | Formulario de edición con datos precargados |
| Eliminar | ✅ | Modal de confirmación + eliminación |
| Filtrar | ✅ | Búsqueda en tiempo real |
| Ordenar | ✅ | Ordenamiento por columnas |

### 👨‍🎓 Alumnos

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Listar | ✅ | Tabla con paginación, ordenamiento y filtro |
| Crear | ✅ | Formulario de registro |
| Editar | ✅ | Formulario de edición con datos precargados |
| Eliminar | ✅ | Modal de confirmación + eliminación |
| Filtrar | ✅ | Búsqueda en tiempo real |
| Ordenar | ✅ | Ordenamiento por columnas |

### 📊 Estadísticas

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Gráfica de barras | ✅ | Total de usuarios por rol |
| Gráfica de pastel | ✅ | Distribución porcentual |

---

## 📱 Pantallas de la Aplicación

### 1. Login (`/login`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Redirección al dashboard tras login exitoso

### 2. Registro de Usuarios (`/registro-usuarios`)
- Selección de tipo de usuario (Admin/Maestro/Alumno)
- Formulario dinámico según el tipo seleccionado
- Validación completa de campos

### 3. Edición de Usuarios (`/registro-usuarios/:rol/:id`)
- Carga automática de datos del usuario
- Campos de contraseña ocultos en modo edición
- Actualización de datos

### 4. Lista de Administradores (`/administrador`)
- Tabla con datos de administradores
- Botones de editar y eliminar
- Validación de permisos

### 5. Lista de Maestros (`/maestros`)
- Tabla con Material Table
- Paginación (5, 10, 20 registros)
- Ordenamiento por columnas
- Filtro de búsqueda
- Botones de editar y eliminar

### 6. Lista de Alumnos (`/alumnos`)
- Tabla con Material Table
- Paginación (5, 10, 20 registros)
- Ordenamiento por columnas
- Filtro de búsqueda
- Botones de editar y eliminar

### 7. Dashboard (`/home`)
- Tarjetas con conteo de usuarios
- Accesos rápidos a cada sección

### 8. Gráficas (`/graficas`)
- Gráfica de barras
- Gráfica de pastel

---

## 🔌 Servicios

### FacadeService
Servicio principal que maneja:
- Login/Logout
- Almacenamiento de cookies
- Obtención de datos del usuario en sesión

```typescript
// Métodos principales
login(username, password)      // Iniciar sesión
logout()                       // Cerrar sesión
getSessionToken()              // Obtener token
getUserCompleteName()          // Nombre completo del usuario
getUserGroup()                 // Rol del usuario (admin/maestro/alumno)
saveUserData(data)             // Guardar datos en cookies
destroyUser()                  // Limpiar cookies
```

### AdministradoresService
```typescript
// Métodos CRUD
registrarAdmin(data)           // Crear administrador
obtenerListaAdmins()           // Listar todos
obtenerAdminPorID(id)          // Obtener por ID
actualizarAdmin(data)          // Actualizar
eliminarAdmin(id)              // Eliminar
getTotalUsuarios()             // Estadísticas
```

### MaestrosService
```typescript
// Métodos CRUD
registrarMaestro(data)         // Crear maestro
obtenerListaMaestros()         // Listar todos
obtenerMaestroPorID(id)        // Obtener por ID
actualizarMaestro(data)        // Actualizar
eliminarMaestro(id)            // Eliminar
```

### AlumnosService
```typescript
// Métodos CRUD
registrarAlumno(data)          // Crear alumno
obtenerListaAlumnos()          // Listar todos
obtenerAlumnoPorID(id)         // Obtener por ID
actualizarAlumno(data)         // Actualizar
eliminarAlumno(id)             // Eliminar
```

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot find module '@angular/...'"
```bash
rm -rf node_modules
npm install
```

### Error: "Port 4200 is already in use"
```bash
# Usar otro puerto
ng serve --port 4300

# O matar el proceso en el puerto 4200
lsof -ti:4200 | xargs kill
```

### Error: "CORS blocked"
Verificar que el backend tenga CORS configurado correctamente y esté corriendo.

### Error: "Token expired" o errores 401
1. Cerrar sesión
2. Volver a iniciar sesión para obtener un nuevo token

### La página no carga después de login
Verificar que las cookies estén habilitadas en el navegador.

---

## 🧪 Ejecutar Tests

```bash
# Tests unitarios
ng test

# Tests con cobertura
ng test --code-coverage
```

---

## 📦 Build para Producción

```bash
# Compilar
ng build --configuration production

# Los archivos estarán en dist/app-movil-escolar-webapp/
```

---

## 🔄 Flujo de Trabajo Típico

1. **Iniciar Backend**
   ```bash
   cd Backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Iniciar Frontend**
   ```bash
   cd Frontend
   ng serve --open
   ```

3. **Acceder a la aplicación**
   - Abrir `http://localhost:4200`
   - Registrar un usuario o hacer login
   - Navegar por las diferentes secciones

---

## 👥 Autores

- Desarrollo Web - Séptimo Semestre
- Universidad

---

## 📄 Licencia

Este proyecto es para fines educativos.
