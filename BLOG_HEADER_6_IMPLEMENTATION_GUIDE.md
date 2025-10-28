# Blog Header 6 Implementation Guide

## Overview
This guide explains how to implement the `blog-header-6` section from the `/realisations` page. This section creates a modern, filterable gallery with a featured item, category filters, and a responsive grid layout.

## HTML Structure

### Main Container
```html
<header id="blog-header-6" class="section_blog6 color-scheme-1">
  <div class="padding-global">
    <div class="container-large">
      <div class="padding-section-large">
        <!-- Content goes here -->
      </div>
    </div>
  </div>
</header>
```

### Complete Implementation Template

```html
<header id="blog-header-6" class="section_blog6 color-scheme-1">
  <div class="padding-global">
    <div class="container-large">
      <div class="padding-section-large">
        <div class="blog6_component">
          
          <!-- Header Section -->
          <div class="margin-bottom margin-xxlarge">
            <div class="max-width-large">
              <div class="margin-bottom margin-small">
                <h1 class="heading-style-h1">[YOUR PAGE TITLE]</h1>
              </div>
              <p class="text-size-medium">[YOUR PAGE DESCRIPTION]</p>
            </div>
          </div>
          
          <!-- Featured Item Section -->
          <div class="margin-bottom margin-xxlarge">
            <div class="blog6_featured-list-wrapper">
              <div class="blog6_featured-list">
                <div class="blog6_featured-item">
                  <a href="[FEATURED_LINK_URL]" class="blog6_featured-item-link w-inline-block">
                    <div class="blog6_image-wrapper">
                      <img sizes="(max-width: 2048px) 100vw, 2048px" 
                           srcset="[IMAGE_SRC_SET]" 
                           alt="[ALT_TEXT]" 
                           src="[MAIN_IMAGE_SRC]" 
                           loading="lazy" 
                           class="blog6_featured-image">
                    </div>
                    <div class="blog6_featured-item-content">
                      <div class="margin-bottom margin-xsmall">
                        <h3 class="heading-style-h4">[FEATURED_TITLE]</h3>
                      </div>
                      <div class="text-size-regular">[FEATURED_DESCRIPTION]</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Filter Menu -->
          <div class="blog6_content">
            <div class="category-filter-menu">
              <a href="#" class="category-filter-link active w-inline-block">
                <div>[CATEGORY_1]</div>
              </a>
              <a href="#" class="category-filter-link w-inline-block">
                <div>[CATEGORY_2]</div>
              </a>
              <a href="#" class="category-filter-link w-inline-block">
                <div>[CATEGORY_3]</div>
              </a>
              <a href="#" class="category-filter-link w-inline-block">
                <div>[CATEGORY_4]</div>
              </a>
            </div>
            
            <!-- Gallery Grid -->
            <div class="blog6_list-wrapper">
              <div class="w-layout-grid blog6_list">
                
                <!-- Gallery Item Template -->
                <div class="blog6_item">
                  <a href="[ITEM_LINK_URL]" class="blog6_item-link w-inline-block">
                    <div class="margin-bottom margin-small">
                      <div class="blog6_image-wrapper">
                        <img loading="lazy" 
                             src="[IMAGE_SRC]" 
                             alt="[ALT_TEXT]" 
                             class="blog6_image">
                      </div>
                    </div>
                  </a>
                  <div class="tag is-alternate [CATEGORY_CLASS]">[CATEGORY_NAME]</div>
                </div>
                
                <!-- Repeat gallery item for each image -->
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</header>
```

## Customization Instructions

### 1. Color Scheme Adaptation
**Important**: Replace `color-scheme-1` with your project's color scheme class.

**Available Color Schemes:**
- `color-scheme-1` (Default - Dark background)
- `color-scheme-2` (Light background)
- `color-scheme-3` (Alternative scheme)

**Example:**
```html
<header id="blog-header-6" class="section_blog6 color-scheme-2">
```

### 2. Content Customization

#### Page Title & Description
```html
<h1 class="heading-style-h1">Your Project Title</h1>
<p class="text-size-medium">Your project description that explains the content</p>
```

#### Featured Item
```html
<!-- Featured Image -->
<img srcset="your-image-500.jpg 500w, your-image-800.jpg 800w, your-image-1080.jpg 1080w" 
     alt="Featured project description" 
     src="your-image-1080.jpg">

<!-- Featured Content -->
<h3 class="heading-style-h4">Featured Project Title</h3>
<div class="text-size-regular">Featured project description</div>
```

#### Category Filters
```html
<div class="category-filter-menu">
  <a href="#" class="category-filter-link active w-inline-block">
    <div>Category 1</div>
  </a>
  <a href="#" class="category-filter-link w-inline-block">
    <div>Category 2</div>
  </a>
  <!-- Add more categories as needed -->
</div>
```

#### Gallery Items
```html
<div class="blog6_item">
  <a href="project-detail-url" class="blog6_item-link w-inline-block">
    <div class="margin-bottom margin-small">
      <div class="blog6_image-wrapper">
        <img loading="lazy" 
             src="project-image.jpg" 
             alt="Project description" 
             class="blog6_image">
      </div>
    </div>
  </a>
  <div class="tag is-alternate category-class">Category Name</div>
</div>
```

### 3. Tag System Customization

#### Tag Classes
The tag system uses the following structure:
```html
<div class="tag is-alternate [CATEGORY_CLASS]">[CATEGORY_NAME]</div>
```

**Available Tag Classes:**
- `rea` (Réalisations)
- `cuisine` (Cuisine)
- `bathroom` (Salle de bain)
- `exterior` (Extérieur)
- `basement` (Sous-sol)

**Custom Tag Implementation:**
```html
<!-- For a custom category -->
<div class="tag is-alternate custom-category">Custom Category</div>
```

### 4. Image Optimization

#### Responsive Images
Use the `srcset` attribute for optimal loading:
```html
<img sizes="(max-width: 2048px) 100vw, 2048px" 
     srcset="image-500.jpg 500w, 
             image-800.jpg 800w, 
             image-1080.jpg 1080w, 
             image-1600.jpg 1600w, 
             image-2048.jpg 2048w" 
     alt="Image description" 
     src="image-1080.jpg" 
     loading="lazy" 
     class="blog6_image">
```

#### Image Requirements
- **Featured Image**: 2048px width recommended
- **Gallery Images**: 800px width minimum
- **Format**: JPG or WebP
- **Compression**: Optimize for web (80-90% quality)

### 5. JavaScript Integration

#### Filter Functionality
Add JavaScript for category filtering:
```javascript
// Category filter functionality
document.querySelectorAll('.category-filter-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.category-filter-link').forEach(l => l.classList.remove('active'));
    
    // Add active class to clicked link
    this.classList.add('active');
    
    // Filter items based on category
    const category = this.textContent.trim();
    filterItems(category);
  });
});

function filterItems(category) {
  const items = document.querySelectorAll('.blog6_item');
  
  items.forEach(item => {
    const itemCategory = item.querySelector('.tag').textContent.trim();
    
    if (category === 'All' || itemCategory === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}
```

### 6. CSS Customization

#### Custom Color Variables
Add to your CSS file:
```css
:root {
  --primary-color: #d3af37; /* Your project's primary color */
  --secondary-color: #1a1a1a; /* Your project's secondary color */
  --accent-color: #ffffff; /* Your project's accent color */
}

/* Override default colors */
.section_blog6.color-scheme-1 {
  background-color: var(--secondary-color);
  color: var(--accent-color);
}

.section_blog6.color-scheme-1 .tag.is-alternate {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
```

#### Responsive Adjustments
```css
@media screen and (max-width: 991px) {
  .blog6_list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 767px) {
  .blog6_list {
    grid-template-columns: 1fr;
  }
  
  .category-filter-menu {
    flex-direction: column;
  }
}
```

## Required CSS Classes

Ensure these classes are available in your CSS:
- `.section_blog6`
- `.blog6_component`
- `.blog6_featured-list-wrapper`
- `.blog6_featured-item`
- `.blog6_featured-item-link`
- `.blog6_image-wrapper`
- `.blog6_featured-image`
- `.blog6_featured-item-content`
- `.blog6_content`
- `.category-filter-menu`
- `.category-filter-link`
- `.blog6_list-wrapper`
- `.blog6_list`
- `.blog6_item`
- `.blog6_item-link`
- `.blog6_image`
- `.tag.is-alternate`

## Implementation Checklist

- [ ] Replace `color-scheme-1` with your project's color scheme
- [ ] Update page title and description
- [ ] Replace featured item content and image
- [ ] Customize category filter menu
- [ ] Add gallery items with proper images and tags
- [ ] Implement JavaScript for filtering (optional)
- [ ] Test responsive behavior
- [ ] Optimize images for web
- [ ] Verify all links are functional

## Notes

- The section uses Webflow's layout grid system (`w-layout-grid`)
- Images should be optimized for web performance
- The `loading="lazy"` attribute improves page load performance
- Category filtering requires JavaScript implementation
- The design is fully responsive and mobile-friendly

## Support

For questions or issues with implementation, refer to the original `/realisations` page structure and ensure all required CSS classes are properly loaded.
