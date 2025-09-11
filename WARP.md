# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Backend (Django REST Framework)
**Location**: `backend/`

```bash
# Setup and activate virtual environment
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Database operations
python manage.py makemigrations
python manage.py migrate

# Development server
python manage.py runserver
```

**Testing**
```bash
# Run Django tests
cd backend
python manage.py test

# Run specific app tests
python manage.py test transactions
```

### Frontend (React)
**Location**: `frontend/`

```bash
# Setup
cd frontend
npm install

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Environment Setup
- Copy `backend/.env.example` to `backend/.env` and configure as needed
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Frontend proxy configured to connect to Django backend

## Architecture Overview

### Backend Architecture
**Django REST Framework with SQLite**
- **Project**: `finance_tracker` - Main Django project configuration
- **App**: `transactions` - Single Django app handling all transaction operations
- **Database**: SQLite (`db.sqlite3`) for development
- **API**: RESTful API with pagination (20 items per page)

**Key Backend Components**:
- `Transaction` model with income/expense types and predefined categories
- `TransactionViewSet` with custom actions for monthly statistics
- Django CORS headers configured for React frontend
- Spanish locale (`es-es`) with Bogotá timezone

**API Endpoints**:
- `/api/transactions/` - CRUD operations with filtering
- `/api/transactions/monthly_stats/` - Aggregated monthly data
- `/api/transactions/current_month_summary/` - Current month summary

### Frontend Architecture  
**React SPA with Bootstrap**
- **Main App**: Single-page application with tab navigation
- **State Management**: useState hooks for local state, no Redux
- **UI Framework**: React Bootstrap with custom styling
- **Charts**: Chart.js with react-chartjs-2 integration
- **HTTP Client**: Axios with base configuration

**Key Frontend Components**:
- `App.js` - Main application shell with tab navigation
- `Dashboard.js` - Monthly summary cards and recent transactions
- `TransactionForm.js` - Transaction creation with dynamic categories
- `TransactionList.js` - Filtered transaction listing with delete functionality
- `Charts.js` - Data visualization components
- `LandingPage.js` - Welcome/intro page
- `api.js` - Centralized API service layer

### Data Flow
1. **Frontend** → API calls via Axios service → **Backend** Django REST API
2. **Backend** processes requests, applies filters/aggregations → SQLite database
3. **Response** flows back through serializers → JSON → **Frontend** state updates

### Transaction Categories
**Income**: salary, freelance, investment, gift, other_income
**Expenses**: food, transport, utilities, entertainment, healthcare, education, shopping, rent, other_expense

## Recent Bug Fixes

### Fixed: Cannot Add Expenses
**Problem**: Frontend had mismatched categories with backend model, causing validation errors when creating expenses.
**Solution**: Synchronized frontend categories in `TransactionForm.js` with backend `Transaction.CATEGORIES`.

### Fixed: Month Filter Off by One
**Problem**: Month filtering showed transactions from previous month due to timezone handling issues.
**Solution**: Improved month filtering logic in `TransactionList.js` to use substring comparison instead of `startsWith()` method.

## Development Guidelines

### Backend Development
- Follow Django REST Framework conventions for viewsets and serializers
- Use custom viewset actions for complex queries (like `monthly_stats`)
- Maintain Spanish language support in model verbose names
- Apply proper filtering via query parameters in viewsets
- Use Django's aggregation functions for statistics calculations

### Frontend Development  
- Component-based architecture with functional components and hooks
- Centralize API calls in `services/api.js`
- Use React Bootstrap components consistently
- Format currency as Colombian Pesos (COP) using Intl.NumberFormat
- Maintain tab-based navigation pattern in main App component
- Handle loading states and error messaging in components

### Category Management
- **CRITICAL**: Keep frontend categories in sync with backend `Transaction.CATEGORIES`
- When adding new categories, update both:
  1. `backend/transactions/models.py` - `Transaction.CATEGORIES`
  2. `frontend/src/components/TransactionForm.js` - `incomeCategories`/`expenseCategories`
  3. `frontend/src/components/TransactionList.js` - `getCategoryLabel()`
  4. `frontend/src/components/Charts.js` - `categoryColors` and `categoryLabels`

### Date Handling
- Use consistent date format (YYYY-MM-DD) throughout the application
- For month filtering, extract year-month using `substring(0, 7)` to avoid timezone issues
- Be careful with JavaScript Date constructor and timezone differences

### Testing Approach
- Django: Use built-in test framework for models, views, and API endpoints
- React: Jest and React Testing Library for component testing
- Test API endpoints with various query parameter combinations
- Test transaction filtering, creation, and deletion workflows
- Always test both income and expense transaction creation

### Common Debugging Steps
1. **Cannot create transactions**: Check category synchronization between frontend and backend
2. **Wrong month filtering**: Verify date format handling in filters
3. **API connection issues**: Ensure backend server is running on port 8000
4. **CORS errors**: Check CORS settings in Django settings.py

### Deployment Considerations
- Update `ALLOWED_HOSTS` in Django settings for production
- Set `DEBUG=False` and proper `SECRET_KEY` via environment variables
- Configure production database (PostgreSQL recommended)
- Build React app and serve static files through Django or separate web server
- Update CORS settings for production domains
