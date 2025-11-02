document.addEventListener("DOMContentLoaded", function() {
    // Tab Navigation
    const tabLinks = document.querySelectorAll('.nav-tabs a');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(tab => {
                tab.parentElement.classList.remove('active');
            });
            
            // Add active class to current tab
            this.parentElement.classList.add('active');
            
            // Hide all tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Show the selected tab pane
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).classList.add('active');
        });
    });
    
    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Get the parent tab pane
            const parentPane = this.closest('.tab-pane');
            
            // Get all gallery items in this tab
            const galleryItems = parentPane.querySelectorAll('.gallery-item');
            
            // Remove active class from all buttons in this tab
            parentPane.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox Functionality
    const lightboxLinks = document.querySelectorAll('.gallery-lightbox');
    
    if (lightboxLinks.length > 0) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="/placeholder.svg" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
                <button class="lightbox-prev">&lsaquo;</button>
                <button class="lightbox-next">&rsaquo;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        
        let currentIndex = 0;
        
        // Open lightbox
        lightboxLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                currentIndex = index;
                updateLightbox();
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Navigate to previous image
        lightboxPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + lightboxLinks.length) % lightboxLinks.length;
            updateLightbox();
        });
        
        // Navigate to next image
        lightboxNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % lightboxLinks.length;
            updateLightbox();
        });
        
        // Update lightbox content
        function updateLightbox() {
            const currentLink = lightboxLinks[currentIndex];
            const imageSrc = currentLink.getAttribute('href');
            const caption = currentLink.getAttribute('data-caption');
            
            lightboxImage.src = imageSrc;
            lightboxCaption.textContent = caption;
        }
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                } else if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + lightboxLinks.length) % lightboxLinks.length;
                    updateLightbox();
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % lightboxLinks.length;
                    updateLightbox();
                }
            }
        });
    }
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const testimonialSlides = testimonialSlider.querySelectorAll('.testimonial-slide');
        
        if (testimonialSlides.length > 1) {
            // Create navigation arrows
            const prevArrow = document.createElement('button');
            prevArrow.className = 'testimonial-prev';
            prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextArrow = document.createElement('button');
            nextArrow.className = 'testimonial-next';
            nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            testimonialSlider.appendChild(prevArrow);
            testimonialSlider.appendChild(nextArrow);
            
            let currentSlide = 0;
            
            // Show only the first slide initially
            testimonialSlides.forEach((slide, index) => {
                if (index !== 0) {
                    slide.style.display = 'none';
                }
            });
            
            // Previous slide
            prevArrow.addEventListener('click', () => {
                testimonialSlides[currentSlide].style.display = 'none';
                currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
                testimonialSlides[currentSlide].style.display = 'block';
            });
            
            // Next slide
            nextArrow.addEventListener('click', () => {
                testimonialSlides[currentSlide].style.display = 'none';
                currentSlide = (currentSlide + 1) % testimonialSlides.length;
                testimonialSlides[currentSlide].style.display = 'block';
            });
            
            // Auto rotate slides
            setInterval(() => {
                testimonialSlides[currentSlide].style.display = 'none';
                currentSlide = (currentSlide + 1) % testimonialSlides.length;
                testimonialSlides[currentSlide].style.display = 'block';
            }, 5000);
        }
    }
    
    // Lazy Loading for Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
    
    // Add Schema Markup for SEO
    function addSchemaMarkup() {
        const gallerySchema = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "SP Cleaning Services Gallery",
            "description": "Before and after cleaning transformations by SP Cleaning Services in Bangalore",
            "image": Array.from(document.querySelectorAll('.gallery-item img')).map(img => {
                return {
                    "@type": "ImageObject",
                    "contentUrl": img.src,
                    "description": img.alt
                };
            })
        };
        
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(gallerySchema);
        document.head.appendChild(schemaScript);
    }
    
    // Add schema markup
    addSchemaMarkup();
});
