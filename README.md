# 🍷 Happy Birthday Devu! (Devatha) ✨

An elegant, interactive, red wine-themed static birthday celebration webpage crafted especially for your best friend **Devatha (Devu)**.

---

## 🎨 Theme & Aesthetic
- **Color Palette**: Deep Velvet Burgundy, Bordeaux Wine, Merlot shades (`#1A0306`, `#530D1A`, `#781324`), accented with Champagne Gold (`#D4AF37`, `#FBEEC1`) and soft rose gold.
- **Glassmorphism & Lighting**: Soft blurred frosted glass cards, glowing candle flames, ambient golden & wine-red dust particles drifting in the background.
- **Fully Responsive & Device-Adaptive**: Fluid design tailored for iPhone SE, mini phones (320px-375px), modern smartphones (iPhone 12-16, Samsung Galaxy, Pixel), tablets/iPads, laptops, and 4K displays. Includes landscape mode support and iOS Safari auto-zoom prevention.

---

## ✨ Features Included

1. **Ambient Floating Dust Particles**:
   - Golden and wine-hued embers that gently drift and shimmer in the background.

2. **Web Audio Music-Box Synthesizer**:
   - Built-in "Happy Birthday" melody in a delicate music-box/celesta arrangement.
   - 100% offline — uses the browser's Web Audio API, no external audio files required.

3. **Interactive 3-Tier Birthday Cake**:
   - Candles with realistic flickering flame animations.
   - Click individual candles to blow them out, or click the **"Blow Out Candles"** button.
   - Realistic smoke puff effect when blown out, chime sounds, and an instant confetti explosion with Devu's wish confirmation!
   - Includes a **"Relight Candles"** option to replay anytime.

4. **3D Velvet Wine Gift Box**:
   - Click the gift box to untie the golden ribbon and pop open the lid.
   - Reveals an intimate, heartfelt letter written specifically for your best friend Devu.

5. **Golden Memories Photo Gallery & Mobile Touch Slider**:
   - Displays all 10 personal photos of Devu (`memories/vd1.jpeg` through `vd10.jpeg`).
   - **Desktop View**: Luxury multi-column vintage Polaroid gallery grid with gold-trim frames and handwritten cursive captions.
   - **Mobile View**: Converts automatically into an intuitive, high-performance horizontal touch slider with swipe gestures, momentum scroll-snap, prev/next arrows, live slide counter (`1 / 10`), and interactive golden dot indicators.
   - **Full-Screen Lightbox**: Tap any photo on desktop or mobile to open an immersive, high-resolution modal with swipe navigation and keyboard support.

6. **The Song That Reminds Me Of You 🎵**:
   - A dedicated music player featuring a spinning velvet-wine vinyl record, animated equalizer bars, live progress bar, and play/pause controls playing your embedded song `song.mp3`.
   - Displays the heartfelt lyrics dedicated to Devu:
     > *Ethana thanima vattum bothum / Enakkul ketkkum geetham nee...*

---

## 🚀 How to View & Open the Webpage

### Option 1: Directly in your browser
Simply double-click `index.html` in file explorer or right-click `index.html` -> **Open With** -> **Chrome / Edge / Firefox / Safari**.

### Option 2: Run a local server (Optional)
In PowerShell:
```powershell
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve
```
Then open `http://localhost:8000` in your web browser.

---

## 📁 File Structure
- `index.html` — Semantic HTML structure & accessible layout.
- `style.css` — Red wine color scheme, velvet gradients, responsive grid, and fluid animations.
- `script.js` — Confetti engine, Web Audio synth, memory gallery slider, and audio player engine.

