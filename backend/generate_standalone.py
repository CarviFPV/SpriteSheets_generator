"""
Standalone Spritesheet Generator Script
Use this script if you want to generate spritesheets without the web interface.
"""

from PIL import Image
import os
import math
import argparse


def generate_spritesheet(
    input_folder,
    output_file="spritesheet.png",
    cols=8,
    padding=2,
    bg_color=(0, 0, 0, 0)
):
    """
    Generate a spritesheet from PNG frames in a folder.
    
    Args:
        input_folder: Path to folder containing PNG frames
        output_file: Output filename for the spritesheet
        cols: Number of columns in the spritesheet
        padding: Space between sprites in pixels
        bg_color: Background color as RGBA tuple
    """
    
    # Load frames
    print(f"Loading frames from {input_folder}...")
    frame_files = sorted([f for f in os.listdir(input_folder) if f.endswith(".png")])
    
    if not frame_files:
        raise ValueError("No PNG frames found in the folder!")
    
    frames = [Image.open(os.path.join(input_folder, f)) for f in frame_files]
    print(f"Loaded {len(frames)} frames")
    
    # All frames must be same size
    w, h = frames[0].size
    print(f"Frame size: {w}x{h}")
    
    # Validate all frames
    for idx, frame in enumerate(frames):
        if frame.size != (w, h):
            raise ValueError(
                f"Frame {frame_files[idx]} has different dimensions ({frame.size}) "
                f"than the first frame ({w}x{h})"
            )
    
    rows = math.ceil(len(frames) / cols)
    
    # Calculate final image size
    sheet_width = cols * w + (cols - 1) * padding
    sheet_height = rows * h + (rows - 1) * padding
    
    print(f"Creating spritesheet: {sheet_width}x{sheet_height}")
    print(f"Grid: {cols} columns x {rows} rows")
    
    # Create empty image
    spritesheet = Image.new("RGBA", (sheet_width, sheet_height), bg_color)
    
    # Paste frames in grid
    for i, frame in enumerate(frames):
        x = (i % cols) * (w + padding)
        y = (i // cols) * (h + padding)
        spritesheet.paste(frame, (x, y))
    
    # Save output
    spritesheet.save(output_file)
    print(f"✅ Spritesheet created: {output_file}")
    
    return {
        "frames": len(frames),
        "frame_size": (w, h),
        "spritesheet_size": (sheet_width, sheet_height),
        "grid": (cols, rows),
        "padding": padding
    }


def main():
    parser = argparse.ArgumentParser(
        description="Generate a spritesheet from PNG frames"
    )
    parser.add_argument(
        "input_folder",
        help="Folder containing PNG frame files"
    )
    parser.add_argument(
        "-o", "--output",
        default="spritesheet.png",
        help="Output filename (default: spritesheet.png)"
    )
    parser.add_argument(
        "-c", "--cols",
        type=int,
        default=8,
        help="Number of columns (default: 8)"
    )
    parser.add_argument(
        "-p", "--padding",
        type=int,
        default=2,
        help="Padding between sprites in pixels (default: 2)"
    )
    parser.add_argument(
        "--bg-r", type=int, default=0,
        help="Background color Red (0-255, default: 0)"
    )
    parser.add_argument(
        "--bg-g", type=int, default=0,
        help="Background color Green (0-255, default: 0)"
    )
    parser.add_argument(
        "--bg-b", type=int, default=0,
        help="Background color Blue (0-255, default: 0)"
    )
    parser.add_argument(
        "--bg-a", type=int, default=0,
        help="Background color Alpha/transparency (0-255, default: 0=transparent)"
    )
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input_folder):
        print(f"❌ Error: Folder '{args.input_folder}' does not exist")
        return
    
    bg_color = (args.bg_r, args.bg_g, args.bg_b, args.bg_a)
    
    try:
        info = generate_spritesheet(
            input_folder=args.input_folder,
            output_file=args.output,
            cols=args.cols,
            padding=args.padding,
            bg_color=bg_color
        )
        
        print("\n📊 Spritesheet Info:")
        print(f"  Frames: {info['frames']}")
        print(f"  Frame Size: {info['frame_size'][0]}x{info['frame_size'][1]}")
        print(f"  Spritesheet Size: {info['spritesheet_size'][0]}x{info['spritesheet_size'][1]}")
        print(f"  Grid: {info['grid'][0]}x{info['grid'][1]}")
        print(f"  Padding: {info['padding']}px")
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
