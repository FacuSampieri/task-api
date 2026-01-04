# 🚀 Task API

API REST desarrollada con **NestJS** y **PostgreSQL** para gestionar usuarios, tareas, grupos y archivos con autenticación basada en JWT con refresh tokens.
## 📋 Tabla de contenidos

- [Características](#características)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Base de datos](#base-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Documentación adicional](#documentación-adicional)

---

## ✨ Características

✅ **Autenticación JWT** con refresh tokens (15m + 7d)  
✅ **Gestión de usuarios** con roles (USER, ADMIN)  
✅ **Sistema de tareas** con estados y prioridades  
✅ **Grupos de tareas** para organización  
✅ **Carga de archivos** asociados a tareas  
✅ **Validación de datos** con class-validator  
✅ **Documentación automática** con Swagger  
✅ **Seguridad** con Helmet y bcrypt  
✅ **ORM Prisma** para manejo de BD  
✅ **Migraciones** de base de datos  

---

## 🔧 Requisitos previos

- **Node.js** >= 18.x
- **npm** o **yarn**
- **PostgreSQL** >= 12
- **Git**

Verifica las versiones instaladas:
```bash
node --version
npm --version
psql --version
```

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd task-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env  # Si existe, o crear manualmente
```

Crear archivo `.env` con las siguientes variables:
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/task_db?schema=public"

# JWT
JWT_SECRET="TuSecretoMuySeguroAqui123456789"
REFRESH_TOKEN_SECRET="OtroSecretoMasSeguro987654321"

# Aplicación (opcional)
NODE_ENV="development"
PORT=3000
```

### 4. Configurar base de datos

Asegúrate de que PostgreSQL esté corriendo:
```bash
# Windows (si instalaste con PostgreSQL installer)
net start postgresql-x64-15  # Reemplaza con tu versión

# O en WSL/Linux/Mac
sudo systemctl start postgresql
```

Crear la base de datos (opcional, Prisma lo puede hacer):
```bash
createdb task_db
```

### 5. Ejecutar migraciones
```bash
npx prisma migrate dev
```

Esto creará todas las tablas necesarias.

### 6. Generar cliente Prisma (si es necesario)
```bash
npx prisma generate
```

---

## ▶️ Ejecución

### Modo desarrollo (con auto-reload)
```bash
npm run start:dev
```
La API estará disponible en `http://localhost:3000`

### Modo producción
```bash
npm run build
npm run start:prod
```

### Modo debug
```bash
npm run start:debug
```

---

## 🌐 API Endpoints

### 📝 Documentación Swagger
Accede a la documentación interactiva en:
```
http://localhost:3000/api
```

### 🔐 Autenticación

#### Registrar usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Juan",
  "lastName": "Pérez",
  "phone": "+34612345678"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Juan",
    "lastName": "Pérez",
    "role": "USER"
  }
}
```

#### Iniciar sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

#### Refrescar token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 👥 Usuarios

#### Obtener todos los usuarios
```http
GET /users
Authorization: Bearer <access_token>
```

#### Obtener usuario por ID
```http
GET /users/:id
Authorization: Bearer <access_token>
```

#### Actualizar usuario
```http
PATCH /users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "lastName": "Nuevo Apellido",
  "phone": "+34612345678"
}
```

#### Eliminar usuario
```http
DELETE /users/:id
Authorization: Bearer <access_token>
```

---

### ✅ Tareas

#### Crear tarea
```http
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Completar proyecto",
  "description": "Terminar la implementación",
  "priority": "HIGH",
  "dueDate": "2026-01-31",
  "groupId": "optional-group-id"
}
```

#### Obtener todas las tareas
```http
GET /tasks
Authorization: Bearer <access_token>
```

#### Obtener tarea por ID
```http
GET /tasks/:id
Authorization: Bearer <access_token>
```

#### Actualizar tarea
```http
PATCH /tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Nuevo título",
  "status": "in_progress",
  "priority": "MEDIUM"
}
```

#### Eliminar tarea
```http
DELETE /tasks/:id
Authorization: Bearer <access_token>
```

---

### 📁 Grupos

#### Crear grupo
```http
POST /groups
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Proyecto Web",
  "color": "#FF5733"
}
```

#### Obtener todos los grupos
```http
GET /groups
Authorization: Bearer <access_token>
```

#### Obtener grupo por ID
```http
GET /groups/:id
Authorization: Bearer <access_token>
```

#### Actualizar grupo
```http
PATCH /groups/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "color": "#33FF57"
}
```

#### Eliminar grupo
```http
DELETE /groups/:id
Authorization: Bearer <access_token>
```

---

### 📎 Archivos

#### Cargar archivo
```http
POST /files/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- file: <archivo>
- taskId: <task-id>
```

#### Descargar archivo
```http
GET /files/download/:fileId
Authorization: Bearer <access_token>
```

---

## 🔐 Autenticación

### Sistema de JWT con Refresh Token

La API utiliza un sistema de dos tokens para mayor seguridad:

#### **Access Token**
- ⏱️ Duración: 15 minutos
- 📝 Uso: Autenticar solicitudes a la API
- 📍 Envío: Header `Authorization: Bearer <token>`

#### **Refresh Token**
- ⏱️ Duración: 7 días
- 📝 Uso: Obtener nuevo access token
- 📍 Envío: Body de solicitud a `/auth/refresh`
- 💾 Almacenado: En base de datos

### Flujo de autenticación

```
1. Usuario hace LOGIN
   ↓
2. Recibe: access_token (15m) + refresh_token (7d)
   ↓
3. Usa access_token para solicitudes autenticadas
   ↓
4. Cuando expira (401):
   - Envía refresh_token a /auth/refresh
   - Recibe nuevos tokens
   ↓
5. Si refresh_token expira → LOGIN nuevamente
```

### Ejemplo en código (Frontend)

```typescript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { access_token, refresh_token } = await response.json();
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Usar access_token en solicitudes
async function apiCall(endpoint) {
  const token = localStorage.getItem('access_token');
  let response = await fetch(endpoint, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Si token expiró, renovar
  if (response.status === 401) {
    const refresh = localStorage.getItem('refresh_token');
    const newTokens = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refresh })
    });
    const { access_token } = await newTokens.json();
    localStorage.setItem('access_token', access_token);
    
    // Reintentar solicitud
    response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
  }
  
  return response.json();
}
```

---

## 🗄️ Base de Datos

### Esquema Prisma

```prisma
model User {
  id           String
  email        String @unique
  name         String
  lastName     String
  phone        String
  role         Role      // USER, ADMIN
  password     String
  refreshToken String?
  tasks        Task[]
  groups       Group[]
  createdAt    DateTime
  updatedAt    DateTime
}

model Task {
  id          String
  title       String
  description String?
  status      Status    // pending, in_progress, completed
  priority    Priority  // LOW, MEDIUM, HIGH
  dueDate     DateTime?
  user        User
  userId      String
  group       Group?
  groupId     String?
  taskFiles   TaskFile[]
  createdAt   DateTime
  updatedAt   DateTime
}

model TaskFile {
  id         String
  fileName   String
  path       String
  mimeType   String
  size       Int
  task       Task
  taskId     String
  uploadedAt DateTime
}

model Group {
  id        String
  name      String
  color     String    // Hex color code
  user      User
  userId    String
  tasks     Task[]
  createdAt DateTime
  updatedAt DateTime
}
```

### Migraciones

Cada cambio en el schema requiere una migración:

```bash
# Crear migración después de cambiar schema.prisma
npx prisma migrate dev --name nombre_descriptivo

# Ver estado de migraciones
npx prisma migrate status

# Revertir última migración (solo desarrollo)
npx prisma migrate resolve --rolled-back <migration-name>

# Reset completo de BD (⚠️ borra datos)
npx prisma migrate reset
```

### Visualizar datos con Prisma Studio

```bash
npx prisma studio
```

Se abrirá una interfaz web en `http://localhost:5555`

---

## 📂 Estructura del Proyecto

```
task-api/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── local-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── refresh-token.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │   └── refresh-token.strategy.ts
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   │
│   ├── users/                # Módulo de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── tasks/                # Módulo de tareas
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   └── entities/
│   │       └── task.entity.ts
│   │
│   ├── groups/               # Módulo de grupos
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   ├── groups.module.ts
│   │   ├── dto/
│   │   │   ├── create-group.dto.ts
│   │   │   └── update-group.dto.ts
│   │   └── entities/
│   │       └── group.entity.ts
│   │
│   ├── files/                # Módulo de archivos
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   └── files.module.ts
│   │
│   ├── prisma/               # Configuración de Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Punto de entrada
│
├── prisma/
│   ├── schema.prisma         # Esquema de BD
│   └── migrations/           # Historial de migraciones
│
├── test/                      # Tests E2E
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── data/
│   └── uploads/              # Archivos cargados
│       └── tasks/
│
├── .env                       # Variables de entorno
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── README.md
```

---

## 🧪 Testing

### Ejecutar tests unitarios
```bash
npm test
```

### Ejecutar tests con cobertura
```bash
npm run test:cov
```

### Ejecutar tests E2E
```bash
npm run test:e2e
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

---

## 📚 Documentación adicional

### Guía de Refresh Token
Para entender en detalle cómo funciona el sistema de refresh tokens:
```bash
cat REFRESH_TOKEN_GUIDE.md
```

### Configuración de variables de entorno
```
JWT_SECRET: Clave secreta para firmar access tokens
REFRESH_TOKEN_SECRET: Clave secreta para refresh tokens (opcional, usa JWT_SECRET si no está definida)
DATABASE_URL: Cadena de conexión a PostgreSQL
NODE_ENV: development, production
PORT: Puerto de la aplicación (default: 3000)
```

---

## 🚨 Solución de problemas

### Error: "ECONNREFUSED" en PostgreSQL

**Problema**: No se puede conectar a la base de datos

**Solución**:
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres

# Si no funciona, reinicia el servicio
# Windows:
net start postgresql-x64-15

# Linux/Mac:
sudo systemctl restart postgresql
```

### Error: "No database schema created"

**Solución**:
```bash
npx prisma migrate dev
```

### Puerto 3000 ya está en uso

**Solución**: Cambia el puerto en `.env` o termina el proceso:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Tokens inválidos o expirados

Verifica que:
- ✅ JWT_SECRET está configurado en `.env`
- ✅ REFRESH_TOKEN_SECRET está configurado (o es igual a JWT_SECRET)
- ✅ El token no ha expirado
- ✅ Se envía correctamente en el header: `Authorization: Bearer <token>`

---

## 📋 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm run start` | Iniciar en modo normal |
| `npm run start:dev` | Iniciar con auto-reload (desarrollo) |
| `npm run start:debug` | Iniciar en modo debug |
| `npm run start:prod` | Iniciar en modo producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run test:watch` | Tests con auto-reload |
| `npm run test:cov` | Tests con reporte de cobertura |
| `npm run test:e2e` | Tests end-to-end |
| `npm run format` | Formatear código con Prettier |

---

## 🔐 Seguridad

### Mejores prácticas implementadas:

✅ **Contraseñas hasheadas** con bcryptjs  
✅ **JWT tokens** con expiración corta  
✅ **Refresh tokens** almacenados en BD  
✅ **Helmet** para headers de seguridad  
✅ **CORS** configurado (si es necesario)  
✅ **Validación** de DTOs con class-validator  
✅ **Guards** para proteger rutas  
✅ **Roles** para control de acceso  

### Recomendaciones adicionales:

- 🔒 Usa HTTPS en producción
- 🔑 Mantén JWT_SECRET seguro (nunca en git)
- 🚫 Implementa rate limiting
- 📝 Registra logs de acceso
- 🛡️ Valida todas las entradas del usuario
- ♻️ Rota tokens regularmente

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia UNLICENSED.

## 🎯 Roadmap

- [ ] Implementar email verification
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Dashboard de analytics
- [ ] Exportar tareas a PDF
- [ ] Mobile app (React Native)
- [ ] Integración con calendario

---

**Última actualización**: Enero 4, 2026  
**Versión**: 0.0.1  
**Mantenedor**: Facundo Sampieri
