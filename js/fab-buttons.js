// Floating Action Buttons (Back to Top + Messenger)
// Handles show/hide animations and click functionality

(function() {
    'use strict';
    
    // Configuration
    const SCROLL_THRESHOLD = 300; // Show buttons after scrolling 300px
    const ANIMATION_DURATION = 300; // Animation duration in ms
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initFloatingButtons();
    });
    
    function initFloatingButtons() {
        // Find all button containers
        const buttonContainers = document.querySelectorAll('.button_bottom');
        
        buttonContainers.forEach(function(container) {
            setupButtonContainer(container);
        });
    }
    
    function setupButtonContainer(container) {
        const messengerButton = container.querySelector('.messenger_button');
        const backToTopButton = container.querySelector('.st_button');
        
        if (!messengerButton || !backToTopButton) {
            console.warn('Floating buttons not found in container');
            return;
        }
        
        // Add initial hidden state
        container.classList.add('fab-hidden');
        
        // Setup messenger button
        setupMessengerButton(messengerButton);
        
        // Setup back to top button
        setupBackToTopButton(backToTopButton);
        
        // Setup scroll listener
        setupScrollListener(container);
    }
    
    function setupMessengerButton(button) {
        // Set messenger link (you can customize this)
        button.href = 'https://m.me/ceramiquejlepage'; // Update with your actual Messenger link
        
        // Add click handler for analytics or other tracking
        button.addEventListener('click', function(e) {
            // Optional: Add analytics tracking here
            console.log('Messenger button clicked');
        });
    }
    
    function setupBackToTopButton(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Optional: Add analytics tracking here
            console.log('Back to top button clicked');
        });
    }
    
    function setupScrollListener(container) {
        let ticking = false;
        
        function updateButtonVisibility() {
            const scrollY = window.scrollY || window.pageYOffset;
            
            if (scrollY > SCROLL_THRESHOLD) {
                container.classList.remove('fab-hidden');
                container.classList.add('fab-visible');
            } else {
                container.classList.remove('fab-visible');
                container.classList.add('fab-hidden');
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateButtonVisibility);
                ticking = true;
            }
        }
        
        // Listen for scroll events
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Initial check
        updateButtonVisibility();
    }
})();
