# CARMEL API

Backend REST para el proyecto integrador CARMEL e-commerce.

## Tecnologías

- Node.js
- Express
- Sequelize
- MariaDB/MySQL
- JWT
- bcryptjs
- CORS

## 1. Base de datos

Crear la base ejecutando `database.sql` en MariaDB/MySQL.

## 2. Configuración

Copiar:

```bash
copy .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

Completar DB_USER, DB_PASSWORD y JWT_SECRET.

## 3. Instalar dependencias

```bash
npm install
```

## 4. Cargar datos iniciales

```bash
npm run seed
```

## 5. Ejecutar

Desarrollo:

```bash
npm run dev
```

API:

`http://localhost:3000`

Estado:

`GET /api/status`

## Usuarios de prueba

Administrador:

- email: admin@carmel.com
- contraseña: admin123

Cliente:

- email: cliente@carmel.com
- contraseña: cliente123

## Endpoints principales

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Catálogo

- GET `/api/categorias`
- GET `/api/productos`
- GET `/api/productos/:id`
- GET `/api/productos?categoria=1`
- GET `/api/productos?search=miel`

### Carrito (JWT)

- GET `/api/carrito`
- POST `/api/carrito/items`
- PUT `/api/carrito/items/:id`
- DELETE `/api/carrito/items/:id`
- DELETE `/api/carrito`

### Órdenes (JWT)

- POST `/api/ordenes`
- GET `/api/ordenes`
- GET `/api/ordenes/:id`

### Administración

- GET `/api/productos/admin/todos`
- POST `/api/productos`
- PUT `/api/productos/:id`
- DELETE `/api/productos/:id` (desactivación lógica)
- GET `/api/usuarios`
- PUT `/api/usuarios/:id`
- GET `/api/usuarios/:id/historial`
- GET `/api/ordenes/admin/todas`
- PUT `/api/ordenes/admin/:id/estado`

## Nota

La compra implementada es simulada. Se registra el método de pago y se genera una orden, pero no se realiza un cobro real mediante Mercado Pago. Esto es coherente con el apartado de alcance del documento del proyecto que deja las pasarelas reales fuera del MVP.
