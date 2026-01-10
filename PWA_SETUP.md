# PWA Setup for Majestic Cars

## Overview
This Progressive Web App (PWA) setup enables Majestic Cars to be installed on mobile devices and work offline.

## What's Configured

### 1. **Service Worker**
- Automatically registered via `vite-plugin-pwa`
- Caches static assets for offline access
- Implements cache-first strategy for fonts and images
- Network-first strategy for API calls

### 2. **Web App Manifest**
- Located at `/manifest.webmanifest` (auto-generated)
- Defines app name, icons, colors, and display mode
- Supports both narrow (mobile) and wide (tablet) screenshots

### 3. **Caching Strategy**
- **Google Fonts**: Cached for 1 year
- **Gstatic Fonts**: Cached for 1 year
- **Unsplash Images**: Cached for 30 days
- **Static Assets**: Cached indefinitely

### 4. **Installation**
Users can install the app on:
- **iOS**: Via "Add to Home Screen" in Safari
- **Android**: Via "Install app" prompt in Chrome/Edge
- **Desktop**: Via browser menu (Chrome, Edge, Firefox)

### 5. **Features**
- ✅ Offline functionality
- ✅ App icon on home screen
- ✅ Standalone app mode (no browser UI)
- ✅ Splash screen on launch
- ✅ Status bar styling
- ✅ Auto-update capability

## Files Modified/Created

1. **vite.config.ts** - Added VitePWA plugin configuration
2. **index.html** - Added PWA meta tags and manifest link
3. **src/main.tsx** - Added service worker registration
4. **src/registerSW.ts** - Service worker registration logic
5. **public/.well-known/assetlinks.json** - App linking configuration

## Testing PWA

### Local Testing
```bash
npm run build
npm run preview
```
Then open `http://localhost:4173` in your browser.

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check "Service Workers" section
4. Verify manifest is loaded under "Manifest"

### Install on Device
1. **Android**: Open in Chrome → Menu → "Install app"
2. **iOS**: Open in Safari → Share → "Add to Home Screen"
3. **Desktop**: Click install icon in address bar (Chrome/Edge)

## Offline Functionality
- All static assets are cached
- Fonts and images are cached
- App works offline after first visit
- Network requests fall back to cache when offline

## Update Strategy
- Service worker checks for updates on every page load
- Users are prompted to refresh when updates are available
- Auto-update is enabled for seamless updates

## Performance Benefits
- Faster load times (cached assets)
- Reduced bandwidth usage
- Works offline
- App-like experience
- Installable on home screen

## Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 92+
- ✅ Safari 15.1+ (iOS 15.1+)
- ✅ Samsung Internet 14+

## Next Steps
1. Build and deploy: `npm run build`
2. Test on real devices
3. Monitor service worker updates
4. Gather user feedback on app experience
