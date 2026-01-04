# ⚡ Quick Start - TrainUp API

Guía rápida para empezar a desarrollar en 5 minutos.

## 1️⃣ Setup inicial

```bash
# Clonar
git clone https://github.com/trainup/task-api.git
cd task-api

# Instalar
npm install

# Configurar .env
cp .env.example .env
# Edita .env con tus valores
```

## 2️⃣ Base de datos

```bash
# Asegúrate que PostgreSQL esté corriendo
# Windows:
net start postgresql-x64-15

# Linux/Mac:
sudo systemctl start postgresql

# Ejecutar migraciones
npx prisma migrate dev
```

## 3️⃣ Iniciar el servidor

```bash
npm run start:dev
```

El servidor estará en: `http://localhost:3000`

## 4️⃣ Probar la API

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Acceder a endpoints protegidos
```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer <access_token>"
```

## 📚 Documentación Swagger

```
http://localhost:3000/api
```

---

## 🔥 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar con hot reload |
| `npm test` | Ejecutar tests |
| `npm run format` | Formatear código |
| `npx prisma studio` | Ver BD con UI |
| `npx prisma migrate dev --name <nombre>` | Nueva migración |
| `npm run build` | Compilar para producción |

---

## ⚠️ Errores comunes

### "ECONNREFUSED" - PostgreSQL no está corriendo
```bash
# Windows
net start postgresql-x64-15

# Linux/Mac
sudo systemctl start postgresql
```

### "Port 3000 already in use"
```bash
# Cambia el puerto en .env
PORT=3001
```

### "No database schema created"
```bash
npx prisma migrate dev
```

---

## 🎯 Próximos pasos

1. 📖 Lee [README.md](./README.md) completo
2. 🔐 Entiende el [Refresh Token](./REFRESH_TOKEN_GUIDE.md)
3. 👷 Revisa [CONTRIBUTING.md](./CONTRIBUTING.md) para contribuir
4. 🧪 Escribe tests para tu código

---

## 💡 Tips

- Usa Prisma Studio para inspeccionar la BD: `npx prisma studio`
- Swagger tiene toda la documentación de endpoints: `/api`
- Los DTOs están en carpetas `dto/` de cada módulo
- Las Guards para autenticación están en `auth/guards/`

¡Happy coding! 🚀
