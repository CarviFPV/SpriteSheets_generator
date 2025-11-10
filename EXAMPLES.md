# Example Usage

## 📂 Preparing Your Frames

### Folder Structure
```
my_animation_frames/
├── frame_0001.png
├── frame_0002.png
├── frame_0003.png
├── frame_0004.png
├── frame_0005.png
└── frame_0006.png
```

**Important Notes:**
- All frames must be PNG format
- All frames must have the **same dimensions** (e.g., all 64x64 or all 128x128)
- Frames should be numbered sequentially for correct ordering
- Use leading zeros for proper sorting (e.g., `frame_0001.png` instead of `frame_1.png`)

## 🎬 Example Scenarios

### Scenario 1: Character Walk Cycle (8 frames)

**Frames:** `walk_01.png` to `walk_08.png` (all 64x64 pixels)

**Settings:**
- Columns: 8 (all frames in one row)
- Padding: 0
- Background: Transparent (0,0,0,0)

**Result:** 512x64 spritesheet (8 frames × 64 width)

### Scenario 2: Explosion Animation (16 frames)

**Frames:** `explosion_01.png` to `explosion_16.png` (all 128x128 pixels)

**Settings:**
- Columns: 8 (2 rows of 8)
- Padding: 2
- Background: Transparent (0,0,0,0)

**Result:** 1038x270 spritesheet (8 columns × 2 rows with 2px padding)

### Scenario 3: UI Icons (24 frames)

**Frames:** `icon_01.png` to `icon_24.png` (all 32x32 pixels)

**Settings:**
- Columns: 6 (4 rows of 6)
- Padding: 4
- Background: White (255,255,255,255)

**Result:** 212x148 spritesheet

## 🎮 Unity 6.2 Setup Example

### Step 1: Import Generated Spritesheet

1. Drag `spritesheet.png` into Unity Assets folder
2. Select the spritesheet in Project window
3. In Inspector, set:
   - **Texture Type**: Sprite (2D and UI)
   - **Sprite Mode**: Multiple
   - **Pixels Per Unit**: 100 (adjust based on your game)
   - **Filter Mode**: Point (for pixel art) or Bilinear (for smooth sprites)
   - **Compression**: None or Low Quality
4. Click **Apply**

### Step 2: Slice the Spritesheet

1. Click **Sprite Editor** button
2. In Sprite Editor window:
   - Click **Slice** dropdown
   - Select **Grid By Cell Count**
   - Set **Column** to your spritesheet columns (e.g., 8)
   - Set **Row** to calculated rows
   - Set **Padding X and Y** to your padding value (e.g., 2)
3. Click **Slice**
4. Click **Apply**

### Step 3: Create Animation

**Option A: Drag-and-Drop Method**
1. Select all sprite slices in Project window (hold Ctrl/Cmd)
2. Drag them into the Scene or Hierarchy
3. Unity prompts to save animation - choose location
4. Animation Controller is created automatically

**Option B: Manual Method**
1. Create empty GameObject
2. Add **Sprite Renderer** component
3. Window → Animation → Animation
4. Click **Create New Animation**
5. Drag sprite slices into Animation timeline
6. Adjust frame rate (e.g., 12 FPS for classic animation)

### Step 4: Configure Animation

**In Animation window:**
- Set **Samples** (frame rate): 12-24 for character animation, 30-60 for smooth effects
- Enable/disable **Loop Time** in Animation Clip settings
- Add Animation Events if needed

**In Animator Controller:**
- Set default state
- Create transitions between animations
- Add parameters for controlling animations via code

## 💻 Using the Standalone Script

### Example 1: Basic Usage
```powershell
python generate_standalone.py my_frames_folder
```
Output: `spritesheet.png` with default settings (8 columns, 2px padding, transparent)

### Example 2: Custom Output Name
```powershell
python generate_standalone.py my_frames_folder -o character_walk.png
```

### Example 3: Custom Grid Layout
```powershell
python generate_standalone.py my_frames_folder -o explosion.png -c 4 -p 0
```
Creates a 4-column layout with no padding

### Example 4: Colored Background
```powershell
python generate_standalone.py my_frames_folder -o icons.png -c 6 -p 4 --bg-r 255 --bg-g 255 --bg-b 255 --bg-a 255
```
Creates a white background spritesheet

### Example 5: Large Animation Set
```powershell
python generate_standalone.py character_animations -o character_full.png -c 10 -p 1
```
10 columns with minimal padding for large sets

## 📐 Calculating Spritesheet Dimensions

### Formula

**Width** = (columns × frame_width) + ((columns - 1) × padding)
**Height** = (rows × frame_height) + ((rows - 1) × padding)

Where: **rows** = ceiling(total_frames ÷ columns)

### Examples

**Example 1:**
- 16 frames of 64×64 pixels
- 8 columns, 2px padding
- Rows = ceiling(16 ÷ 8) = 2

Width = (8 × 64) + (7 × 2) = 512 + 14 = **526 pixels**
Height = (2 × 64) + (1 × 2) = 128 + 2 = **130 pixels**

**Example 2:**
- 20 frames of 128×128 pixels
- 5 columns, 0px padding
- Rows = ceiling(20 ÷ 5) = 4

Width = (5 × 128) + (4 × 0) = **640 pixels**
Height = (4 × 128) + (3 × 0) = **512 pixels**

## 🎨 Best Practices

### Frame Preparation
✅ Use consistent naming with leading zeros
✅ Export all frames at the same resolution
✅ Use PNG format for transparency support
✅ Keep frame dimensions power-of-two when possible (64, 128, 256, etc.)
✅ Test with a small batch first

### Settings Selection
✅ **For Unity 2D games**: Use 4-10 columns, 0-2px padding
✅ **For pixel art**: Use 0px padding, Point filtering
✅ **For smooth sprites**: Use 2-4px padding, Bilinear filtering
✅ **For texture atlases**: Use larger columns (10-16), minimal padding

### Unity Import
✅ Set correct Pixels Per Unit for your game scale
✅ Use Point filter for pixel art, Bilinear for detailed art
✅ Disable mipmaps for 2D sprites
✅ Use appropriate compression based on platform
✅ Test animations at target resolution

## 🐛 Common Mistakes

❌ **Mixing different frame sizes** → All frames must be identical dimensions
❌ **Using JPG format** → Use PNG for transparency and quality
❌ **Irregular naming** → Use sequential numbering with leading zeros
❌ **Too many columns** → Keep it reasonable (8-12) for readability
❌ **Forgetting padding in Unity** → Set slice padding to match generation

## 📱 Platform-Specific Notes

### Unity WebGL
- Keep spritesheet size under 2048×2048 for best compatibility
- Use compression to reduce file size
- Test on target browsers

### Unity Mobile (iOS/Android)
- Use power-of-two dimensions when possible
- Enable compression appropriate for platform
- Consider multiple quality levels

### Unity Desktop
- Higher resolutions acceptable
- Can use larger spritesheets (up to 8192×8192)
- Quality over size optimization
