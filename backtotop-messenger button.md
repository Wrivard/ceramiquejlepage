# Floating Action Buttons (Back to Top + Messenger) - Implementation Guide

This guide explains how to implement, style, and maintain floating action buttons (FABs) for any website. It provides a complete implementation with customizable styling and behavior.

## What you get
- **Back to Top**: Smooth scroll to top with customizable icon
- **Messenger**: Direct conversation link (customizable Facebook page ID)
- **Scroll-based visibility**: Shows after scrolling > 300px with smooth animations
- **Responsive design**: Smaller on mobile, optimized touch targets
- **Customizable styling**: Brand colors, sizes, and spacing

## Files involved
- **CSS**: `css/fab-buttons.css` (contains all FAB styles, animations, and responsive design)
- **JavaScript**: `js/fab-buttons.js` (handles scroll behavior, smooth scroll, and messenger setup)
- **HTML**: Both files are included in all pages via `<link>` and `<script>` tags

## Design specifications (customizable)
- **Colors**: Customizable gradient (default: golden `linear-gradient(135deg, #d3af37 0%, #b8941f 100%)`)
- **Border radius**: `6px` (customizable)
- **Button sizes**: 
  - Desktop: `4rem × 4rem` (customizable)
  - Mobile: `3.5rem × 3.5rem` (customizable)
- **Spacing**: `0.5rem` gap between buttons (desktop), `0.4rem` (mobile)
- **Position**: Fixed bottom-right (`bottom: 3%`, `right: 3%`)
- **Z-index**: `1000` (above all other content)

## How to add the buttons to a page

### 1. Include CSS in `<head>` section:
```html
<link href="css/fab-buttons.css" rel="stylesheet" type="text/css">
```

### 2. Include JavaScript before closing `</body>` tag:
```html
<script src="js/fab-buttons.js" type="text/javascript"></script>
```

### 3. Ensure HTML structure exists:
The script looks for existing `.button_bottom` containers with `.messenger_button` and `.st_button` elements. If not found, it will create them automatically.

## Implementation details

### Messenger Button:
- **Link**: `https://m.me/[FACEBOOK_PAGE_ID]` (replace with your Facebook page ID)
- **Behavior**: Opens in new tab with `target="_blank"`
- **Security**: Includes `rel="noopener noreferrer"`
- **Icon**: Uses existing messenger icon from your design system

### Back to Top Button:
- **Behavior**: Smooth scroll to top using `window.scrollTo({ top: 0, behavior: 'smooth' })`
- **Icon**: Customizable arrow icon sizes
- **Animation**: Subtle hover effects with scale and shadow

### Scroll Behavior:
- **Threshold**: 300px scroll distance (customizable)
- **Animation**: Smooth fade-in/out with `opacity` and `transform`
- **Classes**: Uses `.fab-hidden` class for show/hide state

## CSS Architecture

### Key Classes:
- `.button_bottom`: Main container with flexbox layout
- `.messenger_button`: Messenger button styling
- `.st_button`: Back to top button styling
- `.st_wrapper`: Wrapper for back to top button
- `.fab-hidden`: Hidden state class

### Responsive Breakpoints:
- **Desktop**: Default styles
- **Tablet**: `@media screen and (max-width: 991px)`
- **Mobile**: `@media screen and (max-width: 768px)`

## Customization guide

### 1. Change colors:
Edit the gradient in `css/fab-buttons.css`:
```css
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### 2. Change button sizes:
Modify `width` and `height` values:
```css
/* Desktop */
width: 4rem;  /* Change this */
height: 4rem; /* Change this */

/* Mobile */
width: 3.5rem;  /* Change this */
height: 3.5rem; /* Change this */
```

### 3. Change spacing:
Modify `gap` values:
```css
/* Desktop */
gap: 0.5rem; /* Change this */

/* Mobile */
gap: 0.4rem; /* Change this */
```

### 4. Change Facebook page ID:
Edit `js/fab-buttons.js`:
```javascript
button.href = 'https://m.me/YOUR_FACEBOOK_PAGE_ID';
```

### 5. Change scroll threshold:
Modify the scroll distance in `js/fab-buttons.js`:
```javascript
if (window.scrollY > 300) { // Change 300 to your desired value
```

## Common issues and solutions

### 1. Buttons not appearing:
- **Cause**: Missing CSS or JavaScript files
- **Fix**: Ensure both `css/fab-buttons.css` and `js/fab-buttons.js` are included

### 2. Spacing issues:
- **Cause**: Conflicting CSS from other frameworks (e.g., Webflow, Bootstrap)
- **Fix**: Use `!important` declarations to override conflicting styles

### 3. Messenger not opening conversation:
- **Cause**: Wrong Facebook page ID or incorrect m.me link format
- **Fix**: Verify the Facebook page ID is correct in `js/fab-buttons.js`

### 4. Buttons too big/small:
- **Cause**: Size adjustments needed for your design
- **Fix**: Modify `width` and `height` values in `css/fab-buttons.css`

### 5. Colors don't match brand:
- **Cause**: Default colors don't match your brand palette
- **Fix**: Update the gradient colors in `css/fab-buttons.css`

## Maintenance checklist

### When updating button appearance:
- [ ] Modify styles in `css/fab-buttons.css` only
- [ ] Test on desktop and mobile
- [ ] Verify animations still work smoothly
- [ ] Check that spacing remains consistent
- [ ] Ensure colors match brand guidelines

### When updating functionality:
- [ ] Modify behavior in `js/fab-buttons.js` only
- [ ] Test scroll threshold
- [ ] Verify messenger link opens correctly
- [ ] Test back to top smooth scroll
- [ ] Check for console errors

### When adding to new pages:
- [ ] Include `css/fab-buttons.css` in `<head>`
- [ ] Include `js/fab-buttons.js` before `</body>`
- [ ] Test scroll behavior and button functionality
- [ ] Verify responsive design works

## Default configuration

### Messenger Button:
```javascript
button.href = 'https://m.me/YOUR_FACEBOOK_PAGE_ID';
button.target = '_blank';
button.rel = 'noopener noreferrer';
```

### Button Sizes:
```css
/* Desktop */
width: 4rem;
height: 4rem;

/* Mobile */
width: 3.5rem;
height: 3.5rem;
```

### Spacing:
```css
/* Desktop */
gap: 0.5rem;

/* Mobile */
gap: 0.4rem;
```

### Colors:
```css
background: linear-gradient(135deg, #d3af37 0%, #b8941f 100%);
```

## Testing checklist (per page)
- [ ] Buttons appear after scrolling > 300px
- [ ] Back to top button smoothly scrolls to top
- [ ] Messenger button opens direct conversation in new tab
- [ ] Buttons are properly sized and spaced
- [ ] Animations work smoothly on hover
- [ ] Responsive design works on mobile
- [ ] No console errors in browser dev tools
- [ ] Colors match brand guidelines
- [ ] Icons are properly sized and visible

## Implementation policy
- **Centralized**: All FAB logic is in shared files (`css/fab-buttons.css` and `js/fab-buttons.js`)
- **Consistent**: Same implementation across all pages
- **Maintainable**: Single source of truth for styling and behavior
- **Responsive**: Mobile-first approach with appropriate breakpoints
- **Accessible**: Proper focus states and keyboard navigation support
- **Customizable**: Easy to modify colors, sizes, and behavior for different projects


