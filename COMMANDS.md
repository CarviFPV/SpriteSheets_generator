# Helpful Commands for SpriteSheets Generator

## 🚀 Quick Start

### Start the application (Development)
```powershell
docker-compose up --build
```

### Start in background
```powershell
docker-compose up -d
```

### Stop the application
```powershell
docker-compose down
```

## 📦 Production Deployment

### Build and start production
```powershell
docker-compose -f docker-compose.prod.yml up --build -d
```

### Stop production
```powershell
docker-compose -f docker-compose.prod.yml down
```

## 🔍 Debugging

### View logs (all services)
```powershell
docker-compose logs -f
```

### View backend logs only
```powershell
docker-compose logs -f backend
```

### View frontend logs only
```powershell
docker-compose logs -f frontend
```

### Access backend container
```powershell
docker exec -it spritesheet-backend /bin/sh
```

### Access frontend container
```powershell
docker exec -it spritesheet-frontend /bin/sh
```

## 🧹 Cleanup

### Remove all containers and volumes
```powershell
docker-compose down -v
```

### Clean Docker cache
```powershell
docker system prune -a
```

### Remove unused volumes
```powershell
docker volume prune
```

## 🔧 Development (Without Docker)

### Backend Development
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```powershell
cd frontend
npm install
npm run dev
```

### Standalone Script Usage
```powershell
cd backend
pip install -r requirements.txt
python generate_standalone.py frames_folder -o output.png -c 8 -p 2
```

## 🧪 Testing

### Test Backend API
```powershell
# Health check
curl http://localhost:8000/health

# API documentation
# Open http://localhost:8000/docs in browser
```

### Test Frontend
```powershell
# Open http://localhost:3000 in browser
```

## 📊 Monitoring

### Check running containers
```powershell
docker ps
```

### Check Docker stats
```powershell
docker stats
```

### Check container sizes
```powershell
docker-compose images
```

## 🔄 Update & Rebuild

### Pull latest changes and rebuild
```powershell
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Rebuild single service
```powershell
# Rebuild backend only
docker-compose build --no-cache backend
docker-compose up -d backend

# Rebuild frontend only
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## 🌐 Port Management

### Change ports (edit docker-compose.yml)
```yaml
services:
  backend:
    ports:
      - "8001:8000"  # External:Internal
  frontend:
    ports:
      - "3001:3000"  # External:Internal
```

### Check port usage
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

## 📁 File Management

### Copy files from container
```powershell
docker cp spritesheet-backend:/app/outputs/spritesheet.png .
```

### Copy files to container
```powershell
docker cp frames/ spritesheet-backend:/app/uploads/
```

## 🔐 Security (Production)

### Set environment variables
Create `.env` file:
```env
# Backend
PYTHONUNBUFFERED=1
API_KEY=your-secret-key

# Frontend
VITE_API_URL=https://your-domain.com/api
```

### Use with Docker Compose
```powershell
docker-compose --env-file .env up
```

## 📦 Backup

### Backup volumes
```powershell
docker run --rm -v spritesheets_generator_backend-outputs:/data -v ${PWD}:/backup alpine tar czf /backup/outputs-backup.tar.gz -C /data .
```

### Restore volumes
```powershell
docker run --rm -v spritesheets_generator_backend-outputs:/data -v ${PWD}:/backup alpine tar xzf /backup/outputs-backup.tar.gz -C /data
```

## 🎯 Common Issues

### Issue: Port already in use
```powershell
# Find and kill process
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### Issue: Docker out of space
```powershell
docker system df  # Check usage
docker system prune -a --volumes  # Clean everything
```

### Issue: Can't connect to backend
```powershell
# Check if backend is running
docker ps | findstr backend

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Issue: Frontend build fails
```powershell
# Clear npm cache
docker-compose down
docker volume rm spritesheets_generator_frontend_node_modules
docker-compose build --no-cache frontend
docker-compose up
```
