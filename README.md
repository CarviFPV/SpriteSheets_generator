# Spritesheet Generator

A modern web application for combining PNG frames into spritesheets for Unity 6.2 and other game engines.

## Features

- **Multi-frame Upload**: Upload multiple PNG files at once
- **Configurable Grid**: Set custom columns and padding
- **Custom Background**: Configure RGBA background color (transparent by default)
- **Live Preview**: See your frames before generating
- **Instant Download**: Download generated spritesheets immediately
- **Unity-Ready**: Optimized for Unity 6.2 sprite animation

## Tech Stack

### Backend
- **Python 3.14** - Latest Python runtime
- **FastAPI** - Modern, fast web framework
- **Pillow** - Image processing library
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - Latest React version
- **Vite 7** - Next-generation frontend tooling
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server (optional)

## Prerequisites

- **Docker Desktop** or **Docker Engine** + **Docker Compose**
- **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/CarviFPV/SpriteSheets_generator.git
cd SpriteSheets_generator
```

### 2. Start with Docker Compose (Development)

```powershell
docker-compose up --build
```

This will:
- Build both frontend and backend containers
- Start the backend on `http://localhost:8000`
- Start the frontend on `http://localhost:3000`
- Enable hot-reload for development

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

## Usage

### Web Interface

1. **Upload Frames**: Click "Select PNG Frames" and choose multiple PNG files
2. **Configure Settings**:
   - **Columns**: Number of sprites per row (default: 8)
   - **Padding**: Space between sprites in pixels (default: 2)
   - **Background Color**: RGBA values (default: 0,0,0,0 = transparent)
3. **Generate**: Click "Generate Spritesheet"
4. **Preview**: View the generated spritesheet
5. **Download**: Click "Download Spritesheet" to save

### Python Script (Standalone)

If you prefer to use just the Python script:

```powershell
cd backend
pip install -r requirements.txt
python main.py
```

Then access the API at http://localhost:8000

### API Endpoints

#### Generate Spritesheet
```http
POST /generate
Content-Type: multipart/form-data

Parameters:
- files: PNG files (multiple)
- cols: number (default: 8)
- padding: number (default: 2)
- bg_color_r: 0-255 (default: 0)
- bg_color_g: 0-255 (default: 0)
- bg_color_b: 0-255 (default: 0)
- bg_color_a: 0-255 (default: 0)
```

#### Download Spritesheet
```http
GET /download/{filename}
```

#### Health Check
```http
GET /health
```

## Docker Commands

### Development Mode
```powershell
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Production Mode
```powershell
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## Project Structure

```
SpriteSheets_generator/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend container config
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Component styles
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── package.json        # Node dependencies
│   ├── Dockerfile          # Frontend dev container
│   ├── Dockerfile.prod     # Frontend prod container
│   ├── nginx.conf          # Nginx configuration
│   └── .gitignore
├── docker-compose.yml       # Development orchestration
├── docker-compose.prod.yml  # Production orchestration
├── README.md               # This file
└── LICENSE
```

## Unity 6.2 Integration

### Importing the Spritesheet

1. **Import**: Drag the generated PNG into your Unity Assets folder
2. **Configure**:
   - Set **Texture Type** to "Sprite (2D and UI)"
   - Set **Sprite Mode** to "Multiple"
   - Click **Sprite Editor**
3. **Slice**:
   - Click "Slice" dropdown
   - Choose "Grid By Cell Count" or "Grid By Cell Size"
   - Set **Column** to match your spritesheet (e.g., 8)
   - Set **Padding** to match your settings (e.g., 2)
   - Click "Slice"
4. **Apply**: Click "Apply" to save changes

### Creating Animation

1. Select all sprite slices in the Project window
2. Drag them into the Hierarchy or Scene view
3. Unity will prompt to create an animation - choose location
4. Your sprite animation is ready!

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=/api
```

For production with custom backend URL:
```env
VITE_API_URL=https://your-backend-url.com
```

### Customizing Default Values

Edit `backend/main.py` to change defaults:

```python
@app.post("/generate")
async def generate_spritesheet(
    files: List[UploadFile] = File(...),
    cols: int = Form(8),      # Change default columns
    padding: int = Form(2),   # Change default padding
    # ...
):
```

Edit `frontend/src/App.jsx` to change UI defaults:

```javascript
const [cols, setCols] = useState(8)      // Default columns
const [padding, setPadding] = useState(2) // Default padding
```

## Development

### Backend Development

```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development

```powershell
cd frontend
npm install
npm run dev
```

### Building for Production

**Frontend:**
```powershell
cd frontend
npm run build
```

**Backend:** Already production-ready with FastAPI + Uvicorn

## API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### Port Already in Use

If ports 3000 or 8000 are already in use:

**Option 1**: Stop the conflicting service

**Option 2**: Change ports in `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Change external port
  frontend:
    ports:
      - "3001:3000"  # Change external port
```

### Docker Build Fails

```powershell
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Frontend Can't Connect to Backend

Check that:
1. Backend is running: http://localhost:8000/health
2. CORS is properly configured in `backend/main.py`
3. Proxy settings in `frontend/vite.config.js` are correct

### Images Not Processing

Ensure:
1. All uploaded files are PNG format
2. All frames have the same dimensions
3. Files are not corrupted
4. Sufficient disk space available

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**CarviFPV**
- GitHub: [@CarviFPV](https://github.com/CarviFPV)

## Acknowledgments

- FastAPI for the excellent web framework
- React team for React 19
- Vite team for blazing-fast builds
- Pillow for image processing capabilities

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Unity Sprite Documentation](https://docs.unity3d.com/Manual/Sprites.html)

## Future Enhancements

- [ ] Support for other image formats (JPG, WEBP)
- [ ] Batch processing multiple spritesheets
- [ ] Custom frame ordering
- [ ] Animation preview
- [ ] Export Unity metadata file
- [ ] Texture atlas optimization
- [ ] User authentication
- [ ] Save/load presets

---

Made for game developers using **Python 3.14**, **React 19**, **Vite 7**, and **Docker**
