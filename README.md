# Sistema de Gestión de Inventario — Grupo 12

Aplicación web del **Grupo 12** para la **Tecnicatura Universitaria en Programación (UTN-FRBB)**. Centraliza la gestión de stock, productos, categorías y movimientos de mercadería, partiendo de un prototipo navegable con datos simulados (`mocks`) y preparando la transición hacia persistencia relacional con **Sequelize** y **MySQL**.

---

## Equipo del Grupo 12

* **Lucas Rojas** ( Legajo `22269`): Base del backend, configuración/CORS, contratos de respuesta y documentación técnica; módulo de **Productos y Stock**.
* **Máximo Martinez Moraes** ( Legajo `22331`): Base del frontend, navegación, acceso/perfil y dashboard; módulo de **Categorías y Administración**.
* **Tiago de Rosa Cajarabilla** (Legajo `22850`): Componentes UI compartidos (`DataTable`, `PaginationBar`, `SearchFilterBar`, `ExportReportButton`) y módulo de **Movimientos y Auditoría**.

---

## Dominio, perfiles y módulos

### Perfiles de usuario
* **Administrador / Gerente:** Control total del sistema, gestión de usuarios y permisos, ABM de categorías y productos, y consulta de reportes, auditorías y valorización.
* **Operario / Depósito:** Consulta de ubicación y stock disponible, y registro de ingresos (compras/recepción) y egresos (ventas/despacho).
* **Vendedor:** Consulta de stock disponible en tiempo real y visualización del catálogo de productos.

### Módulos principales
* **Acceso y Perfil:** Login, registro, recuperación de contraseña y perfil de usuario.
* **Dashboard / Home:** Accesos rápidos, estadísticas, alertas de stock bajo y resumen general.
* **Productos y Stock:** Catálogo, ficha técnica, consulta de stock/ubicación, ABM, búsqueda/filtros/paginado/ordenamiento y exportación (`pdf` / `xlsx`).
* **Categorías y Administración:** Gestión de rubros/categorías, configuración, usuarios/permisos y exportación (`pdf` / `xlsx`).
* **Movimientos y Auditoría:** Registro de entradas/salidas con usuario, fecha y hora, alertas de stock mínimo, últimos movimientos, historial/valorización y exportación (`pdf` / `xlsx`).

---

## Arquitectura y stack tecnológico

* **Arquitectura:** Cliente-servidor desacoplada (`frontend/` y `backend/`).
* **Frontend:** React, con soporte para modo mock (`VITE_USE_MOCKS`) y conexión a la API (`VITE_API_URL`).
* **Backend:** Node.js + Express bajo prefijo `/api/v1`, con CORS configurado, soporte de `page`, `limit`, `sortBy`, `order` y filtros, y respuesta unificada `{ msg, code, data }` para estados `2xx`, `4xx` y `5xx`.
* **Datos y evolución:** Datos mock/en memoria durante el prototipo; **Sequelize** + **MySQL** (MySQL Workbench) para persistencia real.
* **Calidad, pruebas y despliegue:** ESLint (`linter`), variables de entorno documentadas en `sample.env` (con `.env` ignorado por `.gitignore`), colección Postman en `.json`, diagrama Entidad-Relación (`DER`), tablero de tickets, API desplegada en **Render** y frontend desplegado conectado a la API.

---

## Estructura del repositorio

```text
gestion-inventario-grupo12/
├── README.md
├── .gitignore
├── docs/
│   ├── der-inventario.png
│   └── postman/
│       └── Gestion-Inventario-Grupo12.postman_collection.json
├── frontend/
│   ├── README.md
│   ├── sample.env
│   ├── .eslintrc.cjs
│   ├── package.json
│   └── src/
│       ├── types/
│       ├── mocks/
│       ├── services/
│       ├── components/
│       │   ├── layout/
│       │   ├── common/
│       │   ├── productos/
│       │   ├── categorias/
│       │   └── movimientos/
│       └── pages/
└── backend/
    ├── README.md
    ├── sample.env
    ├── .eslintrc.cjs
    ├── package.json
    └── src/
        ├── server.js
        ├── app.js
        ├── config/
        ├── middlewares/
        ├── contracts/
        ├── data/
        │   └── models/
        ├── repositories/
        ├── services/
        ├── controllers/
        └── routes/