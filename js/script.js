document.addEventListener("DOMContentLoaded", () => {
  // Fix for Font Awesome 5 sparkles icon
  // Since "fa-sparkles" isn't a standard Font Awesome 5 icon, we'll create a custom solution
  // Find all elements with the class "sparkle"
  const sparkleElements = document.querySelectorAll(".sparkle")

  // Replace the icon with a standard star icon
  sparkleElements.forEach((element) => {
    element.classList.remove("fa-sparkles")
    element.classList.add("fa-star")
  })

  // Header scroll effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Mobile Menu Toggle - Simple and reliable implementation
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".main-nav")
  const body = document.querySelector("body")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      body.classList.toggle("mobile-menu-active")

      // Change icon based on menu state
      const icon = mobileMenuToggle.querySelector("i")
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".main-nav ul li a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("active")
        body.classList.remove("mobile-menu-active")

        const icon = mobileMenuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
      const isClickInsideNav = navMenu.contains(event.target)
      const isClickOnToggle = mobileMenuToggle.contains(event.target)

      if (!isClickInsideNav && !isClickOnToggle) {
        navMenu.classList.remove("active")
        body.classList.remove("mobile-menu-active")

        const icon = mobileMenuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })

  // Form validation
  const contactForm = document.querySelector(".contact-form form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      let isValid = true
      const requiredFields = contactForm.querySelectorAll("[required]")

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")
        } else {
          field.classList.remove("error")
        }
      })

      // Email validation
      const emailField = contactForm.querySelector('input[type="email"]')
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(emailField.value)) {
          isValid = false
          emailField.classList.add("error")
        }
      }

      if (!isValid) {
        e.preventDefault()

        // Show error message
        let errorAlert = contactForm.querySelector(".alert-error")
        if (!errorAlert) {
          errorAlert = document.createElement("div")
          errorAlert.className = "alert alert-error"
          errorAlert.textContent = "Please fill in all required fields correctly."
          contactForm.insertBefore(errorAlert, contactForm.firstChild)
        }
      }
    })
  }

  // Animate stats counter
  const animateStats = () => {
    const statNumbers = document.querySelectorAll(".stat-number")

    statNumbers.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-count"))
      const duration = 2000 // 2 seconds
      const step = target / (duration / 16) // 16ms per frame (approx 60fps)
      let current = 0

      const updateCounter = () => {
        current += step
        if (current < target) {
          stat.textContent = Math.floor(current) + "+"
          requestAnimationFrame(updateCounter)
        } else {
          stat.textContent = target + "+"
        }
      }

      // Start animation when element is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateCounter()
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(stat)
    })
  }

  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".feature-card, .service-card, .area-card, .process-step, .testimonial-card, .cert-item, .gallery-item",
    )

    elements.forEach((element) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate")
              observer.unobserve(entry.target)

              // Add animation styles dynamically
              if (!document.getElementById("animation-styles")) {
                const style = document.createElement("style")
                style.id = "animation-styles"
                style.textContent = `
                .feature-card, .service-card, .area-card, .process-step, .testimonial-card, .cert-item, .gallery-item {
                  opacity: 0;
                  transform: translateY(30px);
                  transition: opacity 0.6s ease, transform 0.6s ease;
                }
                
                .feature-card.animate, .service-card.animate, .area-card.animate, 
                .process-step.animate, .testimonial-card.animate, .cert-item.animate, .gallery-item.animate {
                  opacity: 1;
                  transform: translateY(0);
                }
              `
                document.head.appendChild(style)
              }
            }
          })
        },
        { threshold: 0.2 },
      )

      observer.observe(element)
    })
  }

  // Enhanced testimonial carousel with better transitions
  const initTestimonialCarousel = () => {
    const testimonialCards = document.querySelectorAll(".testimonial-card")
    const prevBtn = document.querySelector(".testimonial-nav-prev")
    const nextBtn = document.querySelector(".testimonial-nav-next")

    if (!testimonialCards.length || !prevBtn || !nextBtn) return

    let currentIndex = 0

    const updateCarousel = () => {
      testimonialCards.forEach((card, index) => {
        card.classList.remove("active", "prev", "next")

        if (index === currentIndex) {
          card.classList.add("active")
        } else if (index === (currentIndex - 1 + testimonialCards.length) % testimonialCards.length) {
          card.classList.add("prev")
        } else if (index === (currentIndex + 1) % testimonialCards.length) {
          card.classList.add("next")
        }
      })
    }

    // Initialize
    updateCarousel()

    // Add transition animation
    const addTransitionAnimation = () => {
      testimonialCards.forEach((card) => {
        card.style.transition = "all 0.5s ease"
      })

      // Remove transition after animation completes
      setTimeout(() => {
        testimonialCards.forEach((card) => {
          card.style.transition = ""
        })
      }, 500)
    }

    // Event listeners with enhanced animation
    prevBtn.addEventListener("click", () => {
      addTransitionAnimation()
      currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length
      updateCarousel()
    })

    nextBtn.addEventListener("click", () => {
      addTransitionAnimation()
      currentIndex = (currentIndex + 1) % testimonialCards.length
      updateCarousel()
    })

    // Auto-rotate every 5 seconds
    let autoRotate = setInterval(() => {
      addTransitionAnimation()
      currentIndex = (currentIndex + 1) % testimonialCards.length
      updateCarousel()
    }, 5000)

    // Pause auto-rotation when hovering over the carousel
    const carouselWrapper = document.querySelector(".testimonial-cards-wrapper")
    if (carouselWrapper) {
      carouselWrapper.addEventListener("mouseenter", () => {
        clearInterval(autoRotate)
      })

      carouselWrapper.addEventListener("mouseleave", () => {
        autoRotate = setInterval(() => {
          addTransitionAnimation()
          currentIndex = (currentIndex + 1) % testimonialCards.length
          updateCarousel()
        }, 5000)
      })
    }
  }

  // Gallery Filter Functionality
  const initGalleryFilter = () => {
    const filterBtns = document.querySelectorAll(".filter-btn")
    const galleryItems = document.querySelectorAll(".gallery-item")

    if (!filterBtns.length || !galleryItems.length) return

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // Filter gallery items
        const filterValue = btn.getAttribute("data-filter")

        galleryItems.forEach((item) => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block"
            // Add animation for appearing items
            setTimeout(() => {
              item.style.opacity = "1"
              item.style.transform = "translateY(0)"
            }, 100)
          } else {
            item.style.opacity = "0"
            item.style.transform = "translateY(20px)"
            setTimeout(() => {
              item.style.display = "none"
            }, 300)
          }
        })
      })
    })
  }

  // Lazy loading for gallery images
  const lazyLoadGalleryImages = () => {
    const galleryImages = document.querySelectorAll('.gallery-image img[loading="lazy"]')

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.src // This triggers the actual load
            imageObserver.unobserve(img)
          }
        })
      })

      galleryImages.forEach((img) => {
        imageObserver.observe(img)
      })
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      galleryImages.forEach((img) => {
        img.src = img.src
      })
    }
  }

  // Run animations
  animateStats()
  animateOnScroll()
  initTestimonialCarousel()
  initGalleryFilter()
  lazyLoadGalleryImages()

  // Schema markup for SEO
  const addSchemaMarkup = () => {
    // Local Business Schema
    const businessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "SP Cleaning Services",
      image: "https://www.yourwebsite.com/images/logo.png",
      url: "https://www.yourwebsite.com",
      telephone: "+91-9876543210",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Main Street",
        addressLocality: "Bangalore",
        postalCode: "560001",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
      sameAs: [
        "https://www.facebook.com/yourcompany",
        "https://www.instagram.com/yourcompany",
        "https://twitter.com/yourcompany",
      ],
      priceRange: "₹₹",
    }

    // Gallery Image Schema
    const galleryItems = document.querySelectorAll(".gallery-item")
    if (galleryItems.length) {
      const imageGallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "SP Cleaning Services Before and After Gallery",
        description: "Before and after cleaning transformations by SP Cleaning Services in Bangalore",
        image: Array.from(galleryItems).map((item) => {
          const img = item.querySelector("img")
          const caption = item.querySelector(".gallery-caption h4")
          return {
            "@type": "ImageObject",
            contentUrl: img ? img.src : "",
            name: caption ? caption.textContent : "",
            description: img ? img.alt : "",
          }
        }),
      }

      const imageGalleryScriptTag = document.createElement("script")
      imageGalleryScriptTag.type = "application/ld+json"
      imageGalleryScriptTag.text = JSON.stringify(imageGallerySchema)
      document.head.appendChild(imageGalleryScriptTag)
    }

    const businessScriptTag = document.createElement("script")
    businessScriptTag.type = "application/ld+json"
    businessScriptTag.text = JSON.stringify(businessSchema)
    document.head.appendChild(businessScriptTag)
  }

  // Add schema markup
  addSchemaMarkup()
})
