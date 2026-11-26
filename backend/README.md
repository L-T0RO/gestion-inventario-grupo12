# Backend API — Sistema de Gestión de Inventario (Grupo 12)

API REST desarrollada con **Node.js** y **Express** para el prototipo del **Sistema de Gestión de Inventario** (UTN FRBB — Grupo 12). En esta etapa del prototipo opera sobre datos simulados en memoria (`mockStore`) con respuestas HTTP unificadas, preparada para evolucionar hacia persistencia con **Sequelize** y **MySQL**.

## Integrantes y distribución del equipo (Grupo 12)
* **Lucas Rojas** (`lucasroket203@gmail.com` — Legajo `22269`) — Infraestructura base del Backend y Entidad **Productos y Stock**
* **Máximo Martinez Moraes** (`maximomm@gmail.com` — Legajo `22331`) — Shell Frontend, Auth/Dashboard y Entidad **Categorías y Administración**
* **Tiago de Rosa Cajarabilla** (`derosatiago@gmail.com` — Legajo `22850`) — Componentes comunes UI y Entidad **Movimientos y Auditoría**

---

## Requisitos previos
* **Node.js** (versión LTS o v24+)
* **npm**
* **Git** (para trabajo con ramas `main` / `master`, `dev` / `develop` y ramas individuales)

---

## Instalación y ejecución local

1. Ubicarse en la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear el archivo `.env` a partir de `sample.env` (el archivo `.env` está ignorado en `.gitignore`):
   ```bash
   cp sample.env .env
   ```
   *(En PowerShell: `Copy-Item sample.env .env`)*

4. Configurar las variables en `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

5. Ejecutar el linter (estandarización de código):
   ```bash
   npm run lint
   ``

6. Iniciar el servidor en modo desarrollo (con recarga automática mediante `node --watch`):
   ```bash
   npm run dev
   ```
   O en modo estándar:
   ```bash
   npm start
   ````

---

## Formato unificado de respuestas HTTP

Todas las respuestas (`2xx`, `4xx` y `5xx`) siguen la estructura estándar:

```json
{
  "msg": "Ok",
  "code": 200,
  "data": {}
}
```

* **`msg`**: Mensaje descriptivo del resultado o error.
* **`code`**: Código HTTP (`200`, `201`, `400`, `404`, `500`, etc.).
* **`data`**: Objeto, arreglo, resultado paginado o `null`.

---

## Endpoints disponibles

### 1. Health Check
* **`GET /api/v1/health`**
  Verifica el estado del servicio.

### 2. Productos y Stock (`/api/v1/productos`)

* **`GET /api/v1/productos`**
  Lista productos con soporte para paginación, ordenamiento, búsqueda y filtros.
  * **Query params soportados**:
    * `page` (número de página, por defecto `1`)
    * `limit` (cantidad de registros por página, por defecto `10`)
    * `sortBy` (campo de ordenamiento: `id`, `codigo`, `nombre`, `categoriaNombre`, `ubicacion`, `stockActual`, `stockMinimo`, `precioUnitario`, `createdAt`)
    * `order` (`asc` o `desc`, por defecto `asc`)
    * `search` (busca por código, nombre, descripción, ubicación o categoría)
    * `categoriaId` (filtra por ID de categoría)
    * `stockBajo` (`true` para filtrar productos donde `stockActual <= stockMinimo`)
  * **Ejemplo**:
    ```http
    GET http://localhost:3000/api/v1/productos?page=1&limit=10&sortBy=id&order=asc
    ```

* **`GET /api/v1/productos/:id`**
  Devuelve el detalle/ficha de un producto por su `id`. Responde `400` ante ID inválido y `404` si no existe.

* **`POST /api/v1/productos`**
  Crea un nuevo producto en memoria (`mockStore`) y responde `201`.
  * **Body JSON de ejemplo**:
    ```json
    {
      "codigo": "PROD-004",
      "nombre": "Auriculares Bluetooth",
      "descripcion": "Auriculares con cancelación de ruido",
      "categoriaId": 1,
      "ubicacion": "Estante A3",
      "stockActual": 2,
      "stockMinimo": 5,
      "precioUnitario": 32000
    }
    ```

* **`PUT /api/v1/productos/:id`** y **`PATCH /api/v1/productos/:id`**
  Actualiza campos de un producto existente por `id` y responde `200`.

* **`DELETE /api/v1/productos/:id`**
  Elimina un producto del almacén en memoria por `id` y responde `200`.

---

## Estructura de archivos del Backend

```text
backend/
├── README.md
├── sample.env
├── .eslintrc.cjs
├── package.json
└── src/
    ├── server.js
    ├── app.js
    ├── config/
    │   ├── env.js
    │   ├── cors.js
    │   └── database.js
    ├── middlewares/
    │   ├── responseFormatter.js
    │   ├── errorHandler.js
    │   └── authMiddleware.js
    ├── contracts/
    │   ├── paginationQuery.contract.js
    │   └── httpResponse.contract.js
    ├── data/
    │   ├── mockStore.js
    │   └── models/
    ├── repositories/
    │   ├── productos.repository.js
    │   ├── categorias.repository.js
    │   └── movimientos.repository.js
    ├── services/
    │   ├── auth.service.js
    │   ├── productos.service.js
    │   ├── categorias.service.js
    │   └── movimientos.service.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── productos.controller.js
    │   ├── categorias.controller.js
    │   └── movimientos.controller.js
    └── routes/
        ├── index.js
        ├── auth.routes.js
        ├── productos.routes.js
        ├── categorias.routes.js
        └── movimientos.routes.js
```

---

## Despliegue (Render) y CORS
* Al desplegar la API en **Render**, configurar `PORT`, `NODE_ENV=production` y `CORS_ORIGIN` con la URL pública del Frontend desplegado.
* En el prototipo, los datos en memoria (`mockStore`) se reinician si el proceso se reinicia; la persistencia definitiva con **Sequelize** y **MySQL** se incorporará en `models/` y `repositories/` sin romper los contratos de la API.