// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langSwitch = document.getElementById('langSwitch');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'tr';
    langSwitch.value = savedLang;
    updateLanguage(savedLang);
    
    // Language switch event
    langSwitch.addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('preferredLanguage', selectedLang);
        updateLanguage(selectedLang);
        
        // Update document direction for RTL languages
        if (selectedLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
    });
    
    // Update language function
    function updateLanguage(lang) {
        // Update document direction for RTL languages
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
        
        const elements = document.querySelectorAll('[data-' + lang + ']');
        elements.forEach(element => {
            const translation = element.getAttribute('data-' + lang);
            if (translation) {
                // Update text content or value based on element type
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    // Language switch event
    langSwitch.addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('preferredLanguage', selectedLang);
        updateLanguage(selectedLang);
    });
    
    // Update language function
    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-' + lang + ']');
        elements.forEach(element => {
            const translation = element.getAttribute('data-' + lang);
            if (translation) {
                // Update text content or value based on element type
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const currentLang = langSwitch.value;
            
            // Simulate form submission
            const messages = {
                tr: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
                en: 'Your message has been sent successfully. We will get back to you as soon as possible.',
                de: 'Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.',
                fr: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                es: 'Su mensaje ha sido enviado con éxito. Nos pondremos en contacto con usted lo antes posible.',
                ar: 'تم إرسال رسالتك بنجاح. سنعاود الاتصال بك في أقرب وقت ممكن.',
                zh: '您的消息已成功发送。我们会尽快与您联系。'
            };
            
            formMessage.textContent = messages[currentLang];
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation
    const animatedElements = document.querySelectorAll('.company-card, .company-detail, .activity-category');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Hero Slider functionality
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (sliderTrack && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        
        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play
        let autoplayInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const sliderContainer = document.querySelector('.hero-slider');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        }
    }
});
