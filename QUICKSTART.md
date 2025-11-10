# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Application

```powershell
docker-compose up --build
```

Wait for the services to start (usually 30-60 seconds).

### Step 2: Open the Application

Open your browser and go to: **http://localhost:3000**

### Step 3: Generate Your Spritesheet

1. Click "Select PNG Frames"
2. Choose your PNG frame files
3. Adjust settings (optional):
   - Columns: 8 (default)
   - Padding: 2px (default)
   - Background: Transparent (default)
4. Click "Generate Spritesheet"
5. Download your spritesheet!

## 🎯 Common Settings

### For Unity Sprite Animations
- **Columns**: 8-10 (depends on your animation length)
- **Padding**: 0-2 (Unity handles spacing well)
- **Background**: 0,0,0,0 (transparent)

### For Web Games
- **Columns**: Based on your layout preference
- **Padding**: 2-4 (for visual separation)
- **Background**: Match your game background or transparent

### For Pixel Art
- **Columns**: Keep frames organized by animation
- **Padding**: 0 (pixel-perfect alignment)
- **Background**: Transparent or solid color

## 🛑 Stop the Application

```powershell
docker-compose down
```

## 📖 Need More Help?

See the full [README.md](README.md) for detailed documentation.

## ⚠️ Troubleshooting

**Port already in use?**
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill the process or change ports in docker-compose.yml
```

**Docker not starting?**
- Make sure Docker Desktop is running
- Try: `docker system prune -a` then rebuild

**Can't upload files?**
- Ensure files are PNG format
- Check file permissions
- Try smaller batch sizes first
