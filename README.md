# Greenwork Project Setup Guide

This project consists of a React + TypeScript frontend and a PHP Slim Framework backend for a room reservation system.

## Prerequisites

- Docker
- Docker Compose

That's all you need! Docker will handle all other dependencies.

## Quick Start with Docker

1. Clone the repository and navigate to the project root:

```bash
git clone <repository-url>
cd greenwork
```

2. Start all services using Docker Compose:

```bash
docker-compose up -d
```

This command will:

- Build and start the backend container
- Build and start the frontend container
- Set up the MySQL database
- Configure all necessary connections

The services will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL Database: localhost:3306

## Initial Database Setup

The database will be automatically initialized when you first run the containers. The schema and initial data are included in the setup scripts.

## Development with Docker

### Viewing Logs

To see the logs of all containers:

```bash
docker-compose logs -f
```

For specific service logs:

```bash
docker-compose logs -f backend  # For backend logs
docker-compose logs -f frontend # For frontend logs
```

### Rebuilding Containers

If you make changes to the Dockerfile or need to rebuild:

```bash
docker-compose up -d --build
```

### Stopping the Project

To stop all containers:

```bash
docker-compose down
```

To stop and remove all data (including database):

```bash
docker-compose down -v
```

The frontend will be available at http://localhost:5173

## Development Tools with Docker

### Backend

- Run tests:

```bash
docker-compose exec backend composer test
```

- Fix code style:

```bash
docker-compose exec backend composer fix-style
```

### Frontend

- Run linting:

```bash
docker-compose exec frontend npm run lint
```

- Format code:

```bash
docker-compose exec frontend npm run format
```

### Database Management

- Access MySQL CLI:

```bash
docker-compose exec db mysql -u root -p greenwork
```

- Import database dumps:

```bash
docker-compose exec -T db mysql -u root -p greenwork < setup_database.sql
```

## Project Structure

### Backend (greenwork_backend)

- `models/` - Database models using Eloquent ORM
- `routes/` - API route definitions
- `src/` - Core application code
- `tests/` - PHPUnit test files

### Frontend (greenwork_frontend)

- `src/components/` - Reusable React components
- `src/screens/` - Page components
- `src/services/` - API service integrations
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks

## API Documentation

The backend provides RESTful API endpoints for:

- User authentication
- Company management
- Room management
- Reservations

For detailed API documentation, please check the backend README at `greenwork_backend/README.md`

## Development Workflow with Docker

1. Pull the latest changes from the repository
2. Rebuild the containers if dependencies changed:
   ```bash
   docker-compose up -d --build
   ```
3. Make your changes following the project's coding standards
4. Run tests and linting using the Docker commands mentioned above
5. Commit your changes

## Troubleshooting Docker Setup

### Container Issues

- Check container status:
  ```bash
  docker-compose ps
  ```
- View container logs:
  ```bash
  docker-compose logs -f [service_name]
  ```
- Restart specific container:
  ```bash
  docker-compose restart [service_name]
  ```

### Backend Issues

- Check logs:
  ```bash
  docker-compose logs backend
  ```
- Access PHP container:
  ```bash
  docker-compose exec backend sh
  ```

### Frontend Issues

- Check logs:
  ```bash
  docker-compose logs frontend
  ```
- Access Node container:
  ```bash
  docker-compose exec frontend sh
  ```

### Database Issues

- Check database logs:
  ```bash
  docker-compose logs db
  ```
- Verify database connection:
  ```bash
  docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"
  ```
- Reset database:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
