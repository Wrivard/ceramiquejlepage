# Google My Maps Integration Setup

This guide explains how to integrate your Google My Map into the website.

## How to Get Your Google My Maps Embed URL

1. **Create or Open Your Google My Map**
   - Go to [Google My Maps](https://www.google.com/maps/d/)
   - Create a new map or open an existing one

2. **Share Your Map**
   - Click the **"Share"** button
   - Set sharing permissions to **"Anyone with the link can view"** (if you want it publicly accessible)
   - Or keep it private if only authenticated users should see it

3. **Get the Embed Code**
   - Click **"Embed map"** in the share dialog
   - You'll see an iframe code like:
     ```html
     <iframe src="https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID&ehbc=2E312F" width="640" height="480"></iframe>
     ```

4. **Extract the src URL**
   - Copy the `src` URL from the iframe
   - It will look like: `https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID&ehbc=2E312F`

5. **Replace in HTML Files**
   - Find `YOUR_MAP_ID` in all HTML files
   - Replace with your actual map ID from the embed URL
   - Or replace the entire `src` attribute with your embed URL

## Files to Update

Replace `YOUR_MAP_ID` in the following files:

- `index.html`
- `soumission.html`
- `a-propos.html`
- `carrelage-commercial.html`
- `carrelage-commercial.html`
- `pose-de-carrelage-residentiel.html`
- `installation-de-plancher-chauffant.html`
- `carreuleur-au-mont-saint-hilaire.html`
- `realisations.html`

## Current Implementation

The Google My Maps embed has been integrated across all pages. The map is embedded using an iframe with the following structure:

```html
<iframe 
  src="https://www.google.com/maps/d/embed?mid=11PfIbTuW78V5xugrmB24jIOgqizdngs&ehbc=2E312F&noprof=1" 
  class="contact16_map" 
  style="width: 100%; height: 450px; border: 0; border-radius: 8px;" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade" 
  title="Céramique JLepage - Mont-Saint-Hilaire">
</iframe>
```

**Map ID:** `11PfIbTuW78V5xugrmB24jIOgqizdngs`

**Status:** ✅ Integrated on all pages

## Benefits of Google My Maps Integration

✅ **No API key required** - Unlike Google Maps API
✅ **No errors** - No NaN coordinate errors
✅ **Easy to update** - Update your map directly in Google My Maps
✅ **Custom markers** - Add custom markers, routes, and areas
✅ **Free** - No usage limits or billing

## Troubleshooting

### Map Not Showing
- Check that the map is shared and accessible
- Verify the map ID in the embed URL is correct
- Ensure the iframe src URL is complete and valid

### Blank Map
- Make sure the map is set to "Anyone with the link can view" if needed
- Check browser console for any iframe blocking errors
- Verify the map ID is correct

