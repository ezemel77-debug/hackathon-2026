# CARMEL — Frontend

Frontend del e-commerce **CARMEL "Productos de mi tierra"**, construido en React + Vite +
Tailwind CSS, siguiendo las historias de usuario y mockups del documento de análisis del
proyecto, y conectado a la API REST de `CARMEL_API`.

## Requisitos

- Node.js 18 o superior
- La API `CARMEL_API` corriendo (ver su propio README)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajustar VITE_API_URL si la API no corre en localhost:3000
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Para generar la build de producción:

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable       | Descripción               | Valor por defecto           |
| -------------- | ------------------------- | --------------------------- |
| `VITE_API_URL` | URL base de la API CARMEL | `http://localhost:3000/api` |

## Estructura

```
src/
  api/client.js          Cliente único de axios hacia la API (todos los endpoints)
  context/                AuthContext (sesión/JWT) y CartContext (carrito)
  components/             Header, BottomNav, ProductCard, chips, estados, rutas protegidas
  pages/                  Home, Catálogo, Detalle, Carrito, Confirmación, Perfil, Login, Registro
  pages/admin/            Panel de administración (Productos, Pedidos, Usuarios)
```

## Funcionalidades implementadas (según Product Backlog)

| HU     | Funcionalidad                      | Estado                                                         |
| ------ | ---------------------------------- | -------------------------------------------------------------- |
| HU-001 | Registro de usuario                | ✅                                                             |
| HU-002 | Inicio de sesión                   | ✅                                                             |
| HU-003 | Cerrar sesión                      | ✅                                                             |
| HU-004 | Visualizar catálogo                | ✅                                                             |
| HU-005 | Filtrar por categoría              | ✅                                                             |
| HU-006 | Ver detalle de producto            | ✅                                                             |
| HU-007 | Agregar producto al carrito        | ✅                                                             |
| HU-008 | Modificar cantidades en el carrito | ✅                                                             |
| HU-009 | Ver carrito de compras             | ✅                                                             |
| HU-010 | Confirmar compra / método de pago  | ✅                                                             |
| HU-011 | Confirmación de compra por email   | Backend no expone envío de email; queda fuera de este frontend |
| HU-012 | Gestionar productos (CRUD admin)   | ✅                                                             |
| HU-013 | Ver pedidos por cliente (admin)    | ✅                                                             |
| HU-014 | Gestión de usuarios (admin)        | ✅                                                             |
| HU-016 | Búsqueda de productos por texto    | ✅                                                             |
| HU-017 | Historial de compras del cliente   | ✅                                                             |

## Notas de diseño

- Paleta verde bosque + acentos de miel y dulce de leche (caramelo), tipografía
  **Fraunces** (display) + **Inter** (UI), mobile-first con navegación inferior en
  mobile y header completo en desktop — siguiendo los mockups del documento de
  análisis.
- El pago con Mercado Pago está simulado: el checkout llama directo a `POST /ordenes`
  del backend (que confirma la orden y descuenta stock), ya que la integración real de
  pasarela de pago está fuera de alcance en esta etapa del proyecto (ver Alcance
  Funcional, Out-of-Scope).
- El QR de la pantalla de confirmación es visual/ilustrativo (no se genera un QR real),
  ya que no hay backend de logística/seguimiento en esta versión.
