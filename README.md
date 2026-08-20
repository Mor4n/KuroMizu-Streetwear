# ⛩️ KuroMizu (黒水) Streetwear — Contemporary Streetwear & E-Commerce SPA ⛩️

KuroMizu Streetwear es una plataforma de e-commerce, la cual está inspirada en la moda urbana contemporánea y la cultura visual japonesa. Diseñada como una Single Page Application (SPA) modular y reactiva que integra gestión de inventario, persistencia local de compras y consumo de servicios relacionales en la nube.

---

## Visión General

KuroMizu resuelve el flujo comercial de una tienda de ropa exclusiva (*drops* de temporada) mediante una interfaz dinámica e intuitiva en el cliente y un backend estructurado para la administración de catálogos y transacciones.

### Módulos del Sistema
* **Catálogo Reactivo:** Renderizado de prendas, selector dinámico de tallas y filtrado multivariable en el cliente (categorías, stock y rango de precios).
* **Gestor de Compras: ** Carrito persistente basado en almacenamiento local (`localStorage`), control de cantidades y cálculo automático de totales.
* **Simulador de Transacciones:** Validación de datos de envío y registro de órdenes vinculadas a la sesión del usuario.
* **Panel de Control:** Interfaz para administradores con operaciones CRUD sobre el inventario, control de existencias y altas de productos.

---

## Arquitectura y Stack Tecnológico

### Frontend
* **Core:** React 18, Vite
* **Enrutamiento:** React Router DOM v6
* **Estilos:** Tailwind CSS
* **Formularios & Validación:** React Hook Form + Zod
* **Cliente HTTP:** Axios

### Backend & Almacenamiento
* **Entorno:** Node.js con Express.js
* **Base de Datos y nube:** PostgreSQL administrado en Supabase
* **Autenticación:** JSON Web Tokens (JWT) + Bcryptjs
* **Despliegue & CI/CD:** Vercel (Frontend SPA) + Render/Railway (API REST)
* **Gestor de Paquetes:** pnpm

---

## Acuerdos y dinámica de trabajo

## Plan de Ejecución y Organización (Cronograma 20-28 Agosto)

El desarrollo se gestionará por entregas incrementales divididas en dos fases:


### Fase 1: Módulos Core Full Stack
  * **Setup & Estructura Base:** Configuración de Supabase (tablas SQL), servidor Express inicial, setup de React con Vite, Tailwind CSS y Layout general.
  * **Auth Full Stack:** Endpoints `/api/auth/register` y `/api/auth/login` integrados con formularios de Login y Registro en React (`react-hook-form` + `zod`).
  * **Catálogo Full Stack:** Endpoint `GET /api/products` consumido por la vista principal (`/`) con renderizado de cards y filtros dinámicos por categoría.
  * **Detalle de Producto:** Endpoint `GET /api/products/:id` conectado a la página individual (`/products/:id`) con selector de tallas.
  * **Administración Base:** Endpoints protegidos `POST /api/products` y `DELETE /api/products/:id` vinculados al formulario del panel de administración en React.

### Fase 2: Transacciones y Estado Global
  * **Carrito de Compras:** Estado global con React Context API, cálculo dinámico de totales y sincronización con `localStorage`.
  * **Órdenes y Checkout:** Endpoint `POST /api/orders` y formulario de checkout simulado para procesar pedidos.
  * **Historial de Pedidos:** Endpoint `GET /api/orders/my-orders` y vista de compras del usuario autenticado.

### Fase 3: Cierre y Producción
  * **Testing & Deploy:** Pruebas de integración, optimización responsiva (mobile-first), configuración de variables de entorno y despliegue final en Vercel.

---

## Flujo de Trabajo en Git

* **`main`**: Rama protegida de producción. Despliegues automáticos a Vercel. 
* **`develop`**: Rama base para la integración continua de características probadas.
* **`feature/*`**: Ramas de desarrollo modular (ej. `feature/cart-context`, `feature/product-api`).

### Convención de Commits
Se implementa el estándar *Conventional Commits*:
* `feat:` Nueva funcionalidad o componente.
* `fix:` Corrección de errores o inconsistencias.
* `style:` Ajustes visuales, maquetación o CSS sin cambios en la lógica.
* `refactor:` Optimización y limpieza de código existente.
* `docs:` Modificaciones en documentación o README.

---

## Organización del Repositorio

```text
kuromizu-streetwear/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── config/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore