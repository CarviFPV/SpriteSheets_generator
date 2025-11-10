import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [files, setFiles] = useState([])
  const [cols, setCols] = useState(8)
  const [padding, setPadding] = useState(2)
  const [bgColor, setBgColor] = useState({ r: 0, g: 0, b: 0, a: 0 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [previewFiles, setPreviewFiles] = useState([])
  const [frameDimensions, setFrameDimensions] = useState(null)
  const [showUnityGuide, setShowUnityGuide] = useState(false)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    setResult(null)
    setError(null)
    
    // Create preview URLs and get first frame dimensions
    const previews = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
    setPreviewFiles(previews)
    
    // Get dimensions of first frame
    if (selectedFiles.length > 0) {
      const img = new Image()
      img.onload = () => {
        setFrameDimensions({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(selectedFiles[0])
    } else {
      setFrameDimensions(null)
    }
  }
  
  // Calculate expected spritesheet dimensions
  const calculateDimensions = () => {
    if (!frameDimensions || files.length === 0) return null
    
    const rows = Math.ceil(files.length / cols)
    const width = cols * frameDimensions.width + (cols - 1) * padding
    const height = rows * frameDimensions.height + (rows - 1) * padding
    
    return { width, height, rows, cols }
  }
  
  const expectedDimensions = calculateDimensions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      setError('Please select at least one PNG file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      
      files.forEach((file) => {
        formData.append('files', file)
      })
      
      formData.append('cols', cols.toString())
      formData.append('padding', padding.toString())
      formData.append('bg_color_r', bgColor.r.toString())
      formData.append('bg_color_g', bgColor.g.toString())
      formData.append('bg_color_b', bgColor.b.toString())
      formData.append('bg_color_a', bgColor.a.toString())

      const response = await axios.post(`${API_URL}/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error generating spritesheet')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result && result.filename) {
      window.open(`${API_URL}/download/${result.filename}`, '_blank')
    }
  }

  const resetForm = () => {
    setFiles([])
    setResult(null)
    setError(null)
    setPreviewFiles([])
    setShowUnityGuide(false)
    document.getElementById('file-input').value = ''
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 Spritesheet Generator</h1>
        <p>Combine PNG frames into a spritesheet for Unity 6.2</p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="file-input">
              Select PNG Frames
              <span className="label-hint">(Multiple files supported)</span>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".png"
              multiple
              onChange={handleFileChange}
              disabled={loading}
            />
            {files.length > 0 && (
              <p className="file-count">{files.length} file(s) selected</p>
            )}
          </div>

          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="cols">Columns</label>
              <input
                id="cols"
                type="number"
                min="1"
                max="32"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="padding">Padding (px)</label>
              <input
                id="padding"
                type="number"
                min="0"
                max="20"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Background Color (RGBA)</label>
            <div className="color-inputs">
              <input
                type="number"
                min="0"
                max="255"
                value={bgColor.r}
                onChange={(e) => setBgColor({ ...bgColor, r: parseInt(e.target.value) || 0 })}
                placeholder="R"
                disabled={loading}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={bgColor.g}
                onChange={(e) => setBgColor({ ...bgColor, g: parseInt(e.target.value) || 0 })}
                placeholder="G"
                disabled={loading}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={bgColor.b}
                onChange={(e) => setBgColor({ ...bgColor, b: parseInt(e.target.value) || 0 })}
                placeholder="B"
                disabled={loading}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={bgColor.a}
                onChange={(e) => setBgColor({ ...bgColor, a: parseInt(e.target.value) || 0 })}
                placeholder="A"
                disabled={loading}
              />
            </div>
            <p className="hint">Default: (0, 0, 0, 0) = Transparent</p>
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading || files.length === 0} className="btn-primary">
              {loading ? 'Generating...' : 'Generate Spritesheet'}
            </button>
            <button type="button" onClick={resetForm} disabled={loading} className="btn-secondary">
              Reset
            </button>
          </div>

          {frameDimensions && (
            <div className="quick-presets">
              <h4>⚡ Quick Presets</h4>
              <div className="preset-buttons">
                <button 
                  type="button"
                  onClick={() => { setCols(1); setPadding(0); }}
                  className="preset-btn"
                  disabled={loading}
                >
                  📏 Preserve Size (1 column)
                </button>
                <button 
                  type="button"
                  onClick={() => { setCols(Math.min(files.length, 10)); setPadding(0); }}
                  className="preset-btn"
                  disabled={loading}
                >
                  📊 Compact Grid
                </button>
                <button 
                  type="button"
                  onClick={() => { setCols(files.length); setPadding(0); }}
                  className="preset-btn"
                  disabled={loading}
                >
                  ➡️ Single Row
                </button>
                <button 
                  type="button"
                  onClick={() => { 
                    const optimalCols = Math.floor(640 / frameDimensions.width);
                    setCols(optimalCols > 0 ? optimalCols : 1);
                    setPadding(0);
                  }}
                  className="preset-btn"
                  disabled={loading}
                >
                  🎯 Fit to 640px Width
                </button>
              </div>
            </div>
          )}
        </form>

        {expectedDimensions && (
          <div className="dimensions-preview">
            <h3>📐 Expected Spritesheet Size</h3>
            <div className="dimensions-info">
              <div className="dimension-item">
                <span className="dimension-label">Output Dimensions:</span>
                <span className="dimension-value highlight">
                  {expectedDimensions.width} × {expectedDimensions.height} pixels
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Frame Size:</span>
                <span className="dimension-value">
                  {frameDimensions.width} × {frameDimensions.height} pixels
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Grid Layout:</span>
                <span className="dimension-value">
                  {expectedDimensions.cols} columns × {expectedDimensions.rows} rows
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Total Frames:</span>
                <span className="dimension-value">{files.length}</span>
              </div>
            </div>
            {frameDimensions.width >= 256 && frameDimensions.height >= 256 && (
              <div className="dimension-hint">
                <strong>💡 Large Frame Detected!</strong>
                Your frames are {frameDimensions.width}×{frameDimensions.height} pixels. 
                To keep each sprite at full size in Unity, use the "📏 Preserve Size" preset (1 column, 0 padding).
                This keeps each frame at its original {frameDimensions.width}×{frameDimensions.height} resolution.
              </div>
            )}
            {frameDimensions.width < 256 && (expectedDimensions.width !== 640 || expectedDimensions.height !== 640) && (
              <div className="dimension-hint">
                <strong>💡 Tip:</strong> To get exactly 640×640, adjust columns and padding. 
                Try: {Math.floor(640 / frameDimensions.width)} columns with 0 padding for {Math.floor(640 / frameDimensions.width) * Math.floor(640 / frameDimensions.height)} frames.
              </div>
            )}
          </div>
        )}

        {previewFiles.length > 0 && (
          <div className="preview-section">
            <h3>Selected Frames ({previewFiles.length})</h3>
            <div className="preview-grid">
              {previewFiles.slice(0, 12).map((file, idx) => (
                <div key={idx} className="preview-item">
                  <img src={file.url} alt={file.name} />
                  <p>{file.name}</p>
                </div>
              ))}
              {previewFiles.length > 12 && (
                <div className="preview-item more">
                  <p>+{previewFiles.length - 12} more</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="alert alert-success">
              <strong>✓ Success!</strong> {result.message}
            </div>
            
            <div className="result-info">
              <h3>Spritesheet Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Frames:</span>
                  <span className="info-value">{result.info.frames}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Frame Size:</span>
                  <span className="info-value">
                    {result.info.frame_size.width} × {result.info.frame_size.height}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Spritesheet Size:</span>
                  <span className="info-value">
                    {result.info.spritesheet_size.width} × {result.info.spritesheet_size.height}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Grid:</span>
                  <span className="info-value">
                    {result.info.grid.cols} × {result.info.grid.rows}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Padding:</span>
                  <span className="info-value">{result.info.padding}px</span>
                </div>
              </div>
            </div>

            <div className="result-preview">
              <h3>Preview</h3>
              <img 
                src={`${API_URL}/download/${result.filename}`} 
                alt="Generated Spritesheet" 
                className="spritesheet-preview"
              />
            </div>

            <button onClick={handleDownload} className="btn-download">
              📥 Download Spritesheet
            </button>

            <button 
              onClick={() => setShowUnityGuide(!showUnityGuide)} 
              className="btn-unity-guide"
            >
              {showUnityGuide ? '📖 Hide' : '🎮 Unity Integration Guide'}
            </button>

            {showUnityGuide && (
              <div className="unity-guide">
                <h3>🎮 Unity 6.2 Integration Guide</h3>
                
                <div className="guide-section">
                  <h4>Step 1: Import to Unity</h4>
                  <ol>
                    <li>Drag the downloaded spritesheet into your Unity Assets folder</li>
                    <li>Select it in the Project window</li>
                    <li>In the <strong>Inspector</strong>, set:
                      <ul>
                        <li><strong>Texture Type:</strong> Sprite (2D and UI)</li>
                        <li><strong>Sprite Mode:</strong> Multiple</li>
                        <li><strong>Pixels Per Unit:</strong> 100 (or your preference)</li>
                        <li><strong>Filter Mode:</strong> Point (pixel art) or Bilinear (smooth)</li>
                      </ul>
                    </li>
                    <li>Click <strong>Apply</strong></li>
                  </ol>
                </div>

                <div className="guide-section">
                  <h4>Step 2: Open Sprite Editor</h4>
                  <ol>
                    <li>Click the <strong>"Sprite Editor"</strong> button in Inspector</li>
                    <li>A new window opens</li>
                  </ol>
                </div>

                <div className="guide-section important">
                  <h4>Step 3: Manual Grid Slice (CRITICAL)</h4>
                  <ol>
                    <li>Click the <strong>"Slice"</strong> dropdown at the top</li>
                    <li>Select <strong>"Grid By Cell Size"</strong></li>
                    <li>Set these exact values:
                      <div className="slice-settings">
                        <div className="setting-group">
                          <strong>Pixel Size:</strong>
                          <div className="setting-values">
                            <span>X: <code>{result.info.frame_size.width}</code></span>
                            <span>Y: <code>{result.info.frame_size.height}</code></span>
                          </div>
                        </div>
                        <div className="setting-group">
                          <strong>Offset:</strong>
                          <div className="setting-values">
                            <span>X: <code>0</code></span>
                            <span>Y: <code>0</code></span>
                          </div>
                        </div>
                        <div className="setting-group">
                          <strong>Padding:</strong>
                          <div className="setting-values">
                            <span>X: <code>{result.info.padding}</code></span>
                            <span>Y: <code>{result.info.padding}</code></span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>Click <strong>"Slice"</strong> button</li>
                    <li>Click <strong>"Apply"</strong> at top-right</li>
                  </ol>
                </div>

                <div className="guide-section">
                  <h4>Step 4: Verify</h4>
                  <ol>
                    <li>Close Sprite Editor</li>
                    <li>In Project window, expand your spritesheet (click the arrow)</li>
                    <li>Click on any individual sprite</li>
                    <li>In Inspector, you should see: <strong>"{result.info.frame_size.width} × {result.info.frame_size.height}"</strong> ✅</li>
                  </ol>
                </div>

                <div className="guide-section warning">
                  <h4>⚠️ Common Issues</h4>
                  <ul>
                    <li><strong>Wrong sprite size?</strong> Make sure you used "Grid By Cell Size" NOT "Automatic"</li>
                    <li><strong>Settings not applying?</strong> Delete the .meta file and re-import</li>
                    <li><strong>Sprites look blurry?</strong> Set Filter Mode to "Point" for pixel art</li>
                  </ul>
                </div>

                <div className="guide-section success">
                  <h4>✅ Quick Checklist</h4>
                  <ul>
                    <li>☐ Texture Type = "Sprite (2D and UI)"</li>
                    <li>☐ Sprite Mode = "Multiple"</li>
                    <li>☐ Opened Sprite Editor</li>
                    <li>☐ Slice → "Grid By Cell Size"</li>
                    <li>☐ Set Pixel Size: {result.info.frame_size.width} × {result.info.frame_size.height}</li>
                    <li>☐ Set Padding: {result.info.padding}</li>
                    <li>☐ Clicked "Slice" then "Apply"</li>
                    <li>☐ Verified sprite shows correct size in Inspector</li>
                  </ul>
                </div>

                <div className="guide-section tip">
                  <h4>💡 Pro Tips</h4>
                  <ul>
                    <li><strong>Animation:</strong> Drag all sprite slices into Scene to auto-create animation</li>
                    <li><strong>Large Frames ({result.info.frame_size.width}×{result.info.frame_size.height}):</strong> Consider if you need this resolution - many games use 128×128 or 256×256</li>
                    <li><strong>Performance:</strong> Use texture compression (ETC2 for Android, ASTC for iOS)</li>
                    <li><strong>Max Size:</strong> Unity supports up to 8192×8192 textures</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made for Unity 6.2 | Python 3.14 + React 19 + Vite 7</p>
      </footer>
    </div>
  )
}

export default App
