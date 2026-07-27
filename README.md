# 📘 Relatos de Exámenes

Aplicación web para **registrar y practicar relatos de exámenes universitarios**, permitiendo filtrar por **materia** y **profesor**, practicar con relatos aleatorios sin repetición en una misma sesión, y valorar/comentar los aportes de la comunidad.

El proyecto está dividido en **backend** (Node.js + TypeScript + MySQL) y **frontend** (Angular + Angular Material).

---

## 🚀 Funcionalidades

### 📖 Estudiar

- Selección obligatoria de **materia**
- Filtro opcional por **profesor**
- Obtención de relatos **aleatorios**
- Evita repetir relatos en una misma sesión (por materia/profesor)
- Botón para **copiar el relato** al portapapeles
- Guardar/quitar de **favoritos** (requiere cuenta)
- Botón para **reportar** un relato (duplicado, materia/profesor incorrecto, contenido inapropiado, otro)
- Visualización de:
  - Materia
  - Fecha del examen
  - Relato
  - Profesor/es

### 🔎 Explorar

- Listado y búsqueda de relatos con **paginación**
- Filtro por materia, profesor y texto libre
- El término buscado queda **resaltado** dentro del texto de cada relato
- Valoración con **estrellas** y **comentarios** por relato (requiere cuenta)
- Botón para **copiar el relato** al portapapeles
- Guardar/quitar de **favoritos** (requiere cuenta)
- Botón para **reportar** un relato

### ✍️ Aportar

- Carga de nuevos relatos de examen
- Selección de:
  - Materia
  - Profesor/es
  - Fecha del examen
- Alta de **profesores nuevos** si no existen
- Validaciones de datos obligatorios
- Relación muchos-a-muchos entre relatos y profesores
- Login **opcional**: se puede aportar como anónimo o autenticado (el relato queda atribuido al usuario si inició sesión)
- **Detección de relatos parecidos**: si un nuevo relato es muy similar a uno existente de la misma materia, queda en estado *pendiente* para revisión en vez de publicarse directamente
- Confirmación visual (snackbar) al guardar, indicando si el relato quedó publicado o pendiente de revisión

### 👤 Cuentas de usuario

- Registro e inicio de sesión con **JWT**
- Sesión persistida en el cliente e interceptor HTTP que adjunta el token
- Autenticación opcional en endpoints públicos y obligatoria en acciones que la requieren (valorar, comentar, moderar)
- **Mis aportes**: pantalla donde el usuario logueado ve sus propios relatos y el estado de cada uno (publicado, en revisión o rechazado)
- **Favoritos**: pantalla con los relatos que el usuario guardó para volver a repasarlos

### 📊 Estadísticas

- Panel con totales generales (relatos, materias, profesores)
- Ranking de relatos aportados por materia y por profesor

### 🛡️ Panel de administración

- **Cola de moderación**: aprobar o rechazar relatos marcados como parecidos/duplicados
- **Cola de reportes**: revisar relatos reportados por usuarios, descartar el reporte o eliminar el relato
- **Gestión de contenido**: borrado lógico (*soft delete*) de relatos y profesores, con papelera para **restaurar** lo eliminado
- Acceso restringido a usuarios con rol de administrador (`isAdmin`)

---

## 🧱 Arquitectura

### Backend

- **Node.js**
- **TypeScript**
- **Express**
- **MySQL** (MySQL Workbench)
- Arquitectura por capas y modular (`controller` → `service` → `repository`) por dominio:
  - `subject`, `teacher`, `exam_report`, `auth`, `rating`, `comment`, `favorite`, `report`, `stats`, `admin`
- Autenticación con **JWT** (`jsonwebtoken`) y hashing de contraseñas con **bcrypt**
- Middlewares de autenticación (`requireAuth`, `optionalAuth`, `requireAdmin`)
- Detección de similitud de texto por trigramas + índice de Jaccard (`similarity.ts`) para moderación de duplicados
- Manejo de errores y validaciones
- Endpoints REST
- Migraciones SQL versionadas (`migrations/`)

### Frontend

- **Angular (standalone components)**
- **Angular Material**
- **Reactive Forms**
- Rutas protegidas con **guards** (`auth.guard`, `admin.guard`) para secciones que requieren login o rol de administrador
- **Interceptor HTTP** para adjuntar el token de autenticación
- Comunicación con backend mediante **HttpClient**
- Manejo reactivo de estado (`Observable`, `BehaviorSubject`)
- Tema claro/oscuro (`theme.service`) y layout con shell de navegación
- UI responsive con paleta clínica clara

---

## 🗄️ Modelo de Datos (simplificado)

- **subjects**

  - id
  - name

- **teachers**

  - id
  - name
  - deleted_at, deleted_by _(soft delete)_

- **users**

  - id
  - name
  - email
  - password_hash
  - is_admin
  - created_at

- **exams**

  - id
  - subject_id
  - title
  - text
  - date_exam
  - created_by _(usuario que lo aportó, opcional)_
  - status _(`approved` / `pending` / `rejected`)_
  - duplicate_of _(relato similar detectado, si aplica)_
  - similarity_score
  - deleted_at, deleted_by _(soft delete)_
  - created_at

- **exam_teacher**

  - exam_id
  - teacher_id

- **exam_ratings**

  - exam_id
  - user_id
  - stars

- **exam_comments**

  - exam_id
  - user_id
  - text
  - created_at

- **exam_favorites**

  - exam_id
  - user_id
  - created_at

- **exam_reports**
  - exam_id
  - reporter_id
  - reason _(`duplicado` / `materia_o_profesor_incorrecto` / `contenido_inapropiado` / `otro`)_
  - comment
  - status _(`open` / `resolved`)_
  - resolved_at, resolved_by
  - created_at

---

## ⚙️ Instalación y ejecución

### 🔹 Requisitos

- Node.js >= 18
- MySQL
- Angular CLI

---

### 🔹 Backend

```bash
cd relatos-backend
npm install
```

Configurar variables de entorno en `relatos-backend/.env`:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

Ejecutar las migraciones SQL de la carpeta `migrations/` (en orden) sobre la base de datos, y luego:

```bash
npm run dev
```

---

### 🔹 Frontend

```bash
cd relatos-frontend/relatos
npm install
npm start
```
