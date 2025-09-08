# Finance Tracker - Aplicación de Seguimiento Financiero

Una aplicación web completa para registrar y visualizar ingresos y egresos mensuales, desarrollada con Django REST Framework en el backend y React con Bootstrap en el frontend.

## 🚀 Características

- **Registro de Transacciones**: Agregar ingresos y egresos con categorías predefinidas
- **Dashboard Interactivo**: Resumen del mes actual con estadísticas clave
- **Filtros Avanzados**: Filtrar transacciones por tipo, mes y categoría
- **Gráficos Interactivos**: Visualización de datos con Chart.js
  - Comparación mensual de ingresos vs egresos
  - Tendencia del balance neto
  - Distribución por categorías
- **Diseño Responsivo**: Interfaz moderna con Bootstrap
- **API REST**: Backend robusto con Django REST Framework

## 🛠️ Tecnologías Utilizadas

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django CORS Headers
- SQLite (base de datos)

### Frontend
- React 18.2.0
- React Bootstrap 2.8.0
- Chart.js 4.4.0
- React Chart.js 2
- Axios para peticiones HTTP
- Date-fns para manejo de fechas

## 📦 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- npm o yarn

### Backend (Django)

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear un entorno virtual:
```bash
python -m venv venv
```

3. Activar el entorno virtual:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
```

5. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

7. Ejecutar el servidor de desarrollo:
```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

### Frontend (React)

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 📊 Uso de la Aplicación

### Dashboard
- Visualiza el resumen del mes actual
- Muestra ingresos, egresos, balance y número de transacciones
- Lista las transacciones más recientes
- Resumen histórico por meses

### Transacciones
- **Formulario de registro**: Agregar nuevas transacciones con título, descripción, monto, tipo, categoría y fecha
- **Lista de transacciones**: Ver todas las transacciones con filtros por tipo, mes y categoría
- **Eliminar transacciones**: Opción para eliminar transacciones existentes

### Gráficos
- **Ingresos vs Egresos**: Gráfico de barras comparativo por mes
- **Tendencia del Balance**: Gráfico de líneas mostrando la evolución del balance neto
- **Distribución por Categorías**: Gráfico circular con el desglose por categorías
- **Estadísticas Generales**: Métricas resumidas de la aplicación

## 🎯 Categorías Disponibles

### Ingresos
- Salario
- Trabajo Independiente
- Inversiones
- Regalo
- Otros Ingresos

### Egresos
- Alimentación
- Transporte
- Servicios Públicos
- Entretenimiento
- Salud
- Educación
- Compras
- Arriendo
- Otros Gastos

## 🔧 API Endpoints

### Transacciones
- `GET /api/transactions/` - Listar transacciones
- `POST /api/transactions/` - Crear transacción
- `PUT /api/transactions/{id}/` - Actualizar transacción
- `DELETE /api/transactions/{id}/` - Eliminar transacción
- `GET /api/transactions/monthly_stats/` - Estadísticas mensuales
- `GET /api/transactions/current_month_summary/` - Resumen del mes actual

### Filtros de Query
- `type`: income o expense
- `month`: YYYY-MM
- `year`: YYYY
- `category`: categoría específica

## 🎨 Características de UI/UX

- **Diseño Responsivo**: Adaptable a dispositivos móviles y desktop
- **Colores Intuitivos**: Verde para ingresos, rojo para egresos
- **Navegación por Pestañas**: Fácil acceso a diferentes secciones
- **Feedback Visual**: Indicadores de carga y mensajes de confirmación
- **Filtros Dinámicos**: Búsqueda y filtrado en tiempo real

## 🚀 Desarrollo Futuro

- Autenticación de usuarios
- Exportación de datos (PDF, Excel)
- Notificaciones y recordatorios
- Presupuestos y metas de ahorro
- Integración con bancos
- Aplicación móvil

## 📝 Licencia

Este proyecto es de uso educativo y está disponible bajo la licencia MIT.
