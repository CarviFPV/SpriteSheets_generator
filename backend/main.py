from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import os
import math
import shutil
import uuid
from typing import List
from datetime import datetime
import io

app = FastAPI(title="Spritesheet Generator API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.get("/")
async def root():
    return {
        "message": "Spritesheet Generator API",
        "version": "1.0.0",
        "endpoints": {
            "/generate": "POST - Generate spritesheet from uploaded frames",
            "/download/{filename}": "GET - Download generated spritesheet",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/generate")
async def generate_spritesheet(
    files: List[UploadFile] = File(...),
    cols: int = Form(8),
    padding: int = Form(2),
    bg_color_r: int = Form(0),
    bg_color_g: int = Form(0),
    bg_color_b: int = Form(0),
    bg_color_a: int = Form(0)
):
    """
    Generate a spritesheet from uploaded PNG frames.
    
    Parameters:
    - files: List of PNG image files
    - cols: Number of columns in the spritesheet (default: 8)
    - padding: Space between sprites in pixels (default: 2)
    - bg_color_r, bg_color_g, bg_color_b, bg_color_a: Background color (RGBA, default: transparent)
    """
    
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    # Create unique session directory
    session_id = str(uuid.uuid4())
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)
    
    try:
        # Save uploaded files
        frames = []
        for idx, file in enumerate(files):
            if not file.filename.lower().endswith('.png'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PNG")
            
            file_path = os.path.join(session_dir, f"frame_{idx:04d}.png")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Load image
            img = Image.open(file_path)
            frames.append(img)
        
        if not frames:
            raise HTTPException(status_code=400, detail="No valid PNG frames found")
        
        # All frames must be same size
        w, h = frames[0].size
        
        # Validate all frames have the same dimensions
        for idx, frame in enumerate(frames):
            if frame.size != (w, h):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Frame {idx} has different dimensions ({frame.size}) than frame 0 ({w}x{h})"
                )
        
        rows = math.ceil(len(frames) / cols)
        
        # Calculate final image size
        sheet_width = cols * w + (cols - 1) * padding
        sheet_height = rows * h + (rows - 1) * padding
        
        # Create background color
        bg_color = (bg_color_r, bg_color_g, bg_color_b, bg_color_a)
        
        # Create empty image
        spritesheet = Image.new("RGBA", (sheet_width, sheet_height), bg_color)
        
        # Paste frames in grid
        for i, frame in enumerate(frames):
            x = (i % cols) * (w + padding)
            y = (i // cols) * (h + padding)
            spritesheet.paste(frame, (x, y))
        
        # Save output
        output_filename = f"spritesheet_{session_id}.png"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        spritesheet.save(output_path)
        
        # Clean up uploaded files
        shutil.rmtree(session_dir)
        
        return JSONResponse(content={
            "success": True,
            "message": "Spritesheet created successfully",
            "filename": output_filename,
            "download_url": f"/download/{output_filename}",
            "info": {
                "frames": len(frames),
                "frame_size": {"width": w, "height": h},
                "spritesheet_size": {"width": sheet_width, "height": sheet_height},
                "grid": {"cols": cols, "rows": rows},
                "padding": padding
            }
        })
    
    except HTTPException:
        # Clean up on error
        if os.path.exists(session_dir):
            shutil.rmtree(session_dir)
        raise
    except Exception as e:
        # Clean up on error
        if os.path.exists(session_dir):
            shutil.rmtree(session_dir)
        raise HTTPException(status_code=500, detail=f"Error generating spritesheet: {str(e)}")


@app.get("/download/{filename}")
async def download_spritesheet(filename: str):
    """
    Download a generated spritesheet.
    """
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    if not filename.startswith("spritesheet_"):
        raise HTTPException(status_code=403, detail="Invalid file")
    
    return FileResponse(
        file_path,
        media_type="image/png",
        filename=filename
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
