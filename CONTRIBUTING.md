# 🤝 Guía de Contribución - Task API

¡Gracias por tu interés en contribuir a Task API! Este documento te guiará a través del proceso.

## 📋 Índice

- [Código de Conducta](#código-de-conducta)
- [Cómo Empezar](#cómo-empezar)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estilo de Código](#estilo-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testing](#testing)

---

## 📖 Código de Conducta

Este proyecto se adhiere a un código de conducta que promueve:

- ✅ Respeto a todos los participantes
- ✅ Ambiente inclusivo y acogedor
- ✅ Comunicación constructiva
- ✅ Tolerancia y paciencia

Cualquier comportamiento inapropiado será reportado a los mantenedores.

---

## 🚀 Cómo Empezar

### 1. Fork el repositorio
```bash
# En GitHub, haz clic en "Fork"
```

### 2. Clona tu fork
```bash
git clone https://github.com/tu-usuario/task-api.git
cd task-api
```

### 3. Agrega el repositorio original como upstream
```bash
git remote add upstream https://github.com/original/task-api.git
```

### 4. Crea una rama para tu feature
```bash
git checkout -b feature/descripcion-corta
# o para bugs:
git checkout -b fix/descripcion-corta
```

---

## 💻 Proceso de Desarrollo

### 1. Instala las dependencias
```bash
npm install
```

### 2. Configura variables de entorno
```bash
cp .env.example .env
# Edita .env con tus valores locales
```

### 3. Inicia el servidor en modo desarrollo
```bash
npm run start:dev
```

### 4. Realiza tus cambios
```bash
# Edita archivos, agrega features, arregla bugs
```

### 5. Mantén tu rama actualizada
```bash
git fetch upstream
git rebase upstream/main
```

### 6. Haz push de tus cambios
```bash
git push origin feature/descripcion-corta
```

---

## 🎨 Estilo de Código

### Convenciones de nombres

**Archivos y carpetas:**
```
✅ Correcto:
- user.service.ts
- create-user.dto.ts
- jwt-auth.guard.ts

❌ Incorrecto:
- UserService.ts
- CreateUserDto.ts
- JwtAuthGuard.ts
```

**Variables y funciones:**
```typescript
✅ Correcto:
const userId = '123';
const getUserById = () => {};
let isAuthenticated = true;

❌ Incorrecto:
const user_id = '123';
const GetUserById = () => {};
let is_authenticated = true;
```

**Clases:**
```typescript
✅ Correcto:
export class UserService {}
export class JwtStrategy {}

❌ Incorrecto:
export class userService {}
export class jwt_strategy {}
```

### Formateo

Ejecuta Prettier antes de hacer commit:
```bash
npm run format
```

### Linting (si está configurado)

```bash
npm run lint
```

---

## 📝 Commits

### Mensaje de commit

Usa el formato Conventional Commits:

```
<tipo>(<alcance>): <descripción breve>

<descripción detallada (opcional)>

<referencias (opcional)>
```

### Tipos permitidos

- **feat**: Nueva característica
- **fix**: Arreglé un bug
- **docs**: Solo cambios en documentación
- **style**: Cambios que no afectan código (formatting, etc)
- **refactor**: Refactorización sin cambiar funcionalidad
- **perf**: Mejora de performance
- **test**: Agregar o actualizar tests
- **chore**: Cambios en build, deps, etc

### Ejemplos

```bash
# Nueva feature
git commit -m "feat(auth): agregar refresh token endpoint"

# Arreglar bug
git commit -m "fix(tasks): corregir filtro de tareas por usuario"

# Actualizar documentación
git commit -m "docs: actualizar instrucciones de instalación"

# Con descripción detallada
git commit -m "feat(users): implementar soft delete

- Agregar campo deletedAt a User
- Excluir usuarios eliminados de queries
- Agregar endpoint de restauración

Cierra #123"
```

---

## 🔄 Pull Requests

### Antes de enviar

1. ✅ Asegúrate de que tu código compila
2. ✅ Ejecuta los tests
3. ✅ Formatea el código
4. ✅ Actualiza la documentación si es necesario
5. ✅ Agrega/actualiza tests para tu código

### Descripción del PR

```markdown
## Descripción
Descripción clara de qué cambios haces y por qué.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Cambio de documentación

## Cambios realizados
- Cambio 1
- Cambio 2
- Cambio 3

## Testing realizado
Describe cómo probaste tus cambios:
- [ ] Test unitario
- [ ] Test E2E
- [ ] Prueba manual

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He ejecutado `npm run format`
- [ ] He actualizado la documentación
- [ ] He agregado tests apropiados
- [ ] Todos los tests pasan
- [ ] No hay cambios sin relacionados
```

### Revisar PRs

Si eres revisor:

1. 👀 Revisa el código cuidadosamente
2. 💬 Haz comentarios constructivos
3. ✅ Aprueba si está bien
4. 🔄 Pide cambios si es necesario

---

## 🧪 Testing

### Ejecutar tests

```bash
# Tests unitarios
npm test

# Tests E2E
npm run test:e2e

# Con coverage
npm run test:cov

# En modo watch
npm run test:watch
```

### Escribir tests

Para cada feature nueva, escribe tests:

```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear un usuario', async () => {
    const user = await service.createUser(mockUserData);
    expect(user.email).toBe(mockUserData.email);
  });
});
```

---

## 🔍 Áreas comunes para contribuir

### 🐛 Reportar Bugs

Crea un issue con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Tu environment (OS, Node version, etc)

### ✨ Sugerir Features

Crea un issue con:
- Descripción clara de la feature
- Caso de uso / motivación
- Posible implementación (opcional)

### 📖 Mejorar Documentación

- Corregir errores de typo
- Aclarar instrucciones confusas
- Agregar ejemplos
- Traducir a otros idiomas

### 🔄 Refactorización

- Mejorar legibilidad
- Reducir complejidad
- Actualizar dependencias
- Mejorar performance

---

## 📦 Dependencias

### Agregar una dependencia nueva

Antes de agregar una nueva dependencia:

1. 🤔 Pregunta: ¿Es realmente necesaria?
2. 📊 Compara alternativas
3. 🔍 Verifica que sea mantenida activamente
4. 💬 Discute en un issue primero

```bash
npm install nueva-dependencia
git add package.json package-lock.json
git commit -m "chore: agregar nueva-dependencia"
```

---

## 🚀 Después de tu contribución

1. 📮 Tu PR será revisado por los mantenedores
2. 💬 Responde a los comentarios/preguntas
3. 🔄 Realiza los cambios solicitados
4. ✅ Una vez aprobado, será mergeado
5. 🎉 ¡Tu contribución estará en el proyecto!

---

## ❓ Preguntas?

- 📖 Revisa la [documentación](./README.md)
- 💬 Abre una [discusión](https://github.com/task-api/issues)
- 📧 Contacta a los mantenedores

---

## 📜 Licencia

Al contribuir, aceptas que tu código será licenciado bajo la misma licencia del proyecto.

---

**¡Gracias por contribuir! 🙌**

Tus contribuciones hacen este proyecto mejor para todos.
