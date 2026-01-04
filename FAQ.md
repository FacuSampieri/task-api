# ❓ FAQ - Task API

Preguntas frecuentes y respuestas sobre la API.

## 🔐 Autenticación & JWT

### P: ¿Cómo obtengo los tokens?
**R:** Haz login en `/auth/login` con email y password. Recibirás `access_token` y `refresh_token`.

### P: ¿Qué diferencia hay entre access_token y refresh_token?
**R:** 
- **Access token**: Válido 15 minutos, se usa para autenticar solicitudes
- **Refresh token**: Válido 7 días, se usa para obtener un nuevo access_token

### P: ¿Dónde envío los tokens?
**R:**
- **Access token**: Header `Authorization: Bearer <token>`
- **Refresh token**: Body de la solicitud a `/auth/refresh`

### P: ¿Qué pasa si mi token expira?
**R:** Recibirás un `401 Unauthorized`. Envía tu refresh_token a `/auth/refresh` para obtener nuevos tokens.

### P: ¿Mi refresh_token puede expirar?
**R:** Sí, después de 7 días. Entonces deberás hacer login nuevamente.

### P: ¿Puedo cambiar la duración de los tokens?
**R:** Sí, en `auth.module.ts` modifica `signOptions`:
```typescript
signOptions: { expiresIn: '30m' }  // Cambiar a 30 minutos
```

---

## 👥 Usuarios

### P: ¿Cómo creo un usuario?
**R:** Usa `POST /auth/register` con email, password, name, lastName, phone.

### P: ¿Cuál es la contraseña mínima?
**R:** El sistema no tiene restricción específica, pero recomendamos mínimo 8 caracteres.

### P: ¿Puedo cambiar mi email?
**R:** No actualmente, pero puedes actualizar otros campos con `PATCH /users/:id`.

### P: ¿Cómo borro mi cuenta?
**R:** Con `DELETE /users/:id` (necesitas ser el propietario o ADMIN).

### P: ¿Cuál es la diferencia entre roles USER y ADMIN?
**R:** Los ADMIN tienen acceso a endpoints administrativos. Actualmente no hay restricción implementada, considera agregar un `@Roles(Role.ADMIN)` decorator.

---

## ✅ Tareas

### P: ¿Cuál es la diferencia entre status y priority?
**R:**
- **Status**: Estado actual (pending, in_progress, completed)
- **Priority**: Importancia (LOW, MEDIUM, HIGH)

### P: ¿Puedo asignar una tarea a otro usuario?
**R:** No, actualmente cada tarea pertenece al usuario que la crea. Considera agregar un campo `assignedTo`.

### P: ¿Qué sucede si elimino una tarea?
**R:** Se elimina la tarea y todos sus archivos asociados (cascada).

### P: ¿Puedo agrupar tareas?
**R:** Sí, con el campo `groupId`. Crea un grupo con `POST /groups` primero.

---

## 📁 Grupos

### P: ¿Para qué sirven los grupos?
**R:** Para organizar tus tareas. Un grupo agrupa múltiples tareas relacionadas.

### P: ¿Puedo compartir un grupo con otros usuarios?
**R:** No actualmente, cada grupo pertenece a un usuario. Considera implementar una tabla `GroupMember`.

### P: ¿Qué es el color en un grupo?
**R:** Es un valor hexadecimal (ej: `#FF5733`) para mostrar el grupo con color en el frontend.

---

## 📎 Archivos

### P: ¿Dónde se guardan los archivos?
**R:** En la carpeta `data/uploads/tasks/{taskId}/`.

### P: ¿Hay límite de tamaño?
**R:** No está implementado, pero puedes agregarlo en `files.service.ts`:
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

### P: ¿Qué tipos de archivo acepta?
**R:** Cualquier tipo. Puedes restringir en `files.controller.ts`:
```typescript
const allowedMimes = ['application/pdf', 'image/png'];
```

### P: ¿Puedo descargar un archivo?
**R:** Sí, con `GET /files/download/:fileId`.

---

## 🗄️ Base de Datos

### P: ¿Cómo cambio el schema?
**R:**
1. Edita `prisma/schema.prisma`
2. Ejecuta `npx prisma migrate dev --name descripcion`
3. Listo, Prisma crea la migración automáticamente

### P: ¿Cómo reviero un cambio en la BD?
**R:**
```bash
# Ver estado
npx prisma migrate status

# Revertir última migración
npx prisma migrate resolve --rolled-back nombre_migracion

# O reset completo (borra todo)
npx prisma migrate reset
```

### P: ¿Cómo veo los datos de la BD?
**R:** Ejecuta `npx prisma studio` y abre `http://localhost:5555`.

### P: ¿Puedo usar otra BD que no sea PostgreSQL?
**R:** Sí, cambia en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // o "sqlite", "sqlserver"
  url      = env("DATABASE_URL")
}
```

---

## 🧪 Testing

### P: ¿Cómo escribo tests?
**R:** Usa Jest y crea archivos `.spec.ts`:
```typescript
describe('UserService', () => {
  it('debe crear un usuario', () => {
    // Tu test aquí
  });
});
```

### P: ¿Cómo ejecuto los tests?
**R:**
```bash
npm test           # Todos los tests
npm run test:cov   # Con coverage
npm run test:watch # En modo watch
```

### P: ¿Cómo hago tests E2E?
**R:**
```bash
npm run test:e2e
# Ve el archivo test/app.e2e-spec.ts para ejemplos
```

---

## 🚀 Deployment

### P: ¿Puedo desplegar esta API?
**R:** Sí, aquí hay opciones:
- **Heroku**: `git push heroku main`
- **Railway**: Conecta tu GitHub repo
- **Vercel**: Solo para Serverless (requiere adaptaciones)
- **AWS/GCP/Azure**: Usa Docker

### P: ¿Cómo creo un Dockerfile?
**R:**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### P: ¿Es seguro deployar así?
**R:** Cambios de seguridad recomendados:
- 🔒 Usa HTTPS
- 🔑 Guardía JWT_SECRET en secrets
- 🚫 Agrega rate limiting
- 📝 Implementa logging
- 🛡️ Agrega CORS si es necesario

---

## 🐛 Troubleshooting

### P: El servidor no inicia
**R:** Verifica:
```bash
# 1. PostgreSQL está corriendo
psql -U postgres

# 2. Variables de .env son correctas
cat .env

# 3. Las dependencias están instaladas
npm install

# 4. Las migraciones están aplicadas
npx prisma migrate dev
```

### P: Token inválido / Unauthorized
**R:** Asegúrate:
- ✅ JWT_SECRET está en `.env`
- ✅ El token no ha expirado
- ✅ Se envía en el header correcto
- ✅ Tiene el prefijo `Bearer `

### P: CORS error
**R:** Agrega CORS en `main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### P: Error al cargar archivo
**R:** Verifica:
- ✅ La carpeta `data/uploads/tasks/` existe
- ✅ Tienes permisos de escritura
- ✅ El taskId es válido
- ✅ El archivo no es muy grande

---

## 📞 Ayuda Adicional

Si tu pregunta no está aquí:

1. 📖 Lee [README.md](./README.md)
2. 🔍 Busca en GitHub Issues
3. 💬 Abre una nueva discusión
4. 📧 Contacta a los mantenedores

---

**Última actualización**: Enero 4, 2026
