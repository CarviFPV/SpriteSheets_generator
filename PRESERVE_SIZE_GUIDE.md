# 🎯 Maintaining Original Frame Resolution in Spritesheets

## Your Situation

You have:
- **17 frames** at **640×640 pixels** each
- Default settings created a **5134×1924** spritesheet
- Unity sliced it incorrectly as **126×176** per sprite ❌

## The Problem

When you use 8 columns and 2px padding with 640×640 frames:
```
Spritesheet Width  = (8 × 640) + (7 × 2) = 5,134 pixels
Spritesheet Height = (3 × 640) + (2 × 2) = 1,924 pixels
```

This creates a MASSIVE spritesheet that Unity struggles to slice correctly.

## ✅ The Solution: Preserve Original Size

### Option 1: Vertical Stack (RECOMMENDED)
**Best for maintaining exact 640×640 per frame**

**Settings:**
- **Columns:** 1
- **Padding:** 0px

**Result:**
- Spritesheet: 640×10,880 pixels (640 wide × (17 × 640) tall)
- Each frame: 640×640 pixels ✅

**Unity Slice Settings:**
- Slice Type: Grid By Cell Count
- Columns: 1
- Rows: 17
- Padding: 0
- Result: Each sprite is 640×640 ✅

---

### Option 2: Horizontal Strip
**Good for wide animations**

**Settings:**
- **Columns:** 17 (all frames in one row)
- **Padding:** 0px

**Result:**
- Spritesheet: 10,880×640 pixels (17 × 640 wide × 640 tall)
- Each frame: 640×640 pixels ✅

**Unity Slice Settings:**
- Slice Type: Grid By Cell Count
- Columns: 17
- Rows: 1
- Padding: 0
- Result: Each sprite is 640×640 ✅

---

### Option 3: Compact Grid (4×5)
**Balanced layout**

**Settings:**
- **Columns:** 4
- **Padding:** 0px

**Result:**
- Spritesheet: 2,560×3,200 pixels (4 wide × 5 tall)
- Grid: 4 columns × 5 rows (20 slots, 17 filled)
- Each frame: 640×640 pixels ✅

**Unity Slice Settings:**
- Slice Type: Grid By Cell Count
- Columns: 4
- Rows: 5
- Padding: 0
- Result: Each sprite is 640×640 ✅

---

## 🚀 Quick Fix Steps

### In the Web Interface:

1. **Upload your 17 frames** (640×640 each)

2. **Click "📏 Preserve Size" preset button**
   - This automatically sets: Columns = 1, Padding = 0

3. **Generate the spritesheet**

4. **Download and import to Unity**

### In Unity:

1. **Select the spritesheet** in Project window

2. **Set Texture Type:** Sprite (2D and UI)

3. **Set Sprite Mode:** Multiple

4. **Open Sprite Editor**

5. **Click Slice dropdown:**
   - Type: Grid By Cell Count
   - Columns: 1 (or whatever you used)
   - Rows: 17 (or calculate based on your frames)
   - Padding: 0

6. **Click Slice, then Apply**

7. **Verify:** Each sprite should now be 640×640 ✅

---

## 📊 Comparison Table

| Layout | Columns | Padding | Spritesheet Size | Each Sprite | Unity Columns | Unity Rows |
|--------|---------|---------|------------------|-------------|---------------|------------|
| **Vertical Stack** | 1 | 0 | 640×10,880 | 640×640 ✅ | 1 | 17 |
| **Horizontal Strip** | 17 | 0 | 10,880×640 | 640×640 ✅ | 17 | 1 |
| **Compact 4×5** | 4 | 0 | 2,560×3,200 | 640×640 ✅ | 4 | 5 |
| ❌ Default (8 cols, 2px) | 8 | 2 | 5,134×1,924 | 126×176 ❌ | Wrong! | Wrong! |

---

## 🎮 Why This Happens

### With Padding:
When you add padding, Unity's auto-slicer gets confused:
```
Total Width = 5,134 pixels
If Unity tries 8 columns: 5,134 ÷ 8 = 641.75 pixels per "cell"
But padding throws off the calculation!
Result: Wrong slice size (126×176)
```

### Without Padding:
Unity can calculate perfectly:
```
Spritesheet: 2,560 pixels wide
Columns: 4
Each sprite: 2,560 ÷ 4 = 640 pixels ✅
```

---

## ⚡ New Features to Help You

I just added:

### 1. **Quick Preset Buttons**
- 📏 **Preserve Size:** Sets columns=1, padding=0
- 📊 **Compact Grid:** Balanced grid layout
- ➡️ **Single Row:** All frames horizontally
- 🎯 **Fit to 640px:** Auto-calculates for 640px width

### 2. **Large Frame Detection**
When you upload 640×640 frames, you'll see:
```
💡 Large Frame Detected!
Your frames are 640×640 pixels.
To keep each sprite at full size in Unity,
use the "📏 Preserve Size" preset.
```

### 3. **Real-Time Dimension Preview**
See exactly what size your spritesheet will be BEFORE generating!

---

## 🎯 The Golden Rule

**For ANY frame size you want to preserve:**

```
Columns = 1 (vertical stack)
Padding = 0 (no spacing)

OR

Columns = number of frames (horizontal strip)
Padding = 0 (no spacing)
```

**NEVER use padding if you want to maintain exact dimensions!**

---

## 💡 Pro Tips

### Tip 1: Vertical Stack for Animations
If you're creating an animation sequence, use:
- Columns: 1
- This keeps frames in order vertically
- Easy to slice in Unity

### Tip 2: Power-of-Two Consideration
640 is NOT power-of-two (512, 1024, 2048)
- Some older devices prefer power-of-two textures
- Consider resizing frames to 512×512 if needed
- Or accept 640 for modern Unity (usually fine!)

### Tip 3: Texture Compression
For 640×640 frames:
- Use appropriate compression in Unity
- Android: ETC2
- iOS: ASTC
- Standalone: BC7

### Tip 4: Check Unity Import Settings
After slicing:
1. Click on a single sprite in Project window
2. Check its dimensions in Inspector
3. Should say "640 × 640" ✅

---

## 🐛 Troubleshooting

### Problem: Unity still shows wrong size
**Solution:**
1. Delete the spritesheet from Unity
2. Clear the import cache (Edit → Preferences → GI Cache → Clean Cache)
3. Re-import with correct Sprite Editor settings

### Problem: Spritesheet too large for Unity
**Solution:**
- Unity max texture size: 8192×8192
- If vertical stack exceeds this (>12 frames at 640×640)
- Use compact grid (4 columns) instead

### Problem: Performance issues in Unity
**Solution:**
- 640×640 per frame is LARGE for sprites
- Consider if you really need this resolution
- Many games use 128×128 or 256×256
- Use mipmaps if scaling down in-game

---

## 📋 Checklist

Before generating:
- [ ] Columns = 1 (or appropriate number)
- [ ] Padding = 0
- [ ] Check "Expected Spritesheet Size" preview
- [ ] Verify each dimension is divisible by frame count

After importing to Unity:
- [ ] Texture Type = Sprite (2D and UI)
- [ ] Sprite Mode = Multiple
- [ ] Opened Sprite Editor
- [ ] Sliced with correct columns/rows
- [ ] Verified one sprite shows 640×640 in Inspector

---

**Remember:** The key to maintaining exact resolution is:
1. **0 padding**
2. **Correct column count**
3. **Matching Unity slice settings**

Use the new preset buttons for instant correct settings! 🎉
