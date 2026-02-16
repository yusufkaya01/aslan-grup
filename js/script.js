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
        
        // Update country code selection based on language
        const countryCodeInput = document.getElementById('countryCode');
        if (countryCodeInput && window.selectCountryByLang) {
            window.selectCountryByLang(lang);
        }
    }
    
    // Contact form AJAX submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formMessage = document.getElementById('formMessage');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            // Disable submit button during submission
            submitButton.disabled = true;
            submitButton.textContent = '...';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const currentLang = langSwitch.value;
                    const messages = {
                        tr: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
                        en: 'Your message has been sent successfully! We will get back to you soon.',
                        de: 'Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns bald bei Ihnen melden.',
                        fr: 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.',
                        es: '¡Su mensaje ha sido enviado con éxito! Nos pondremos en contacto con usted pronto.',
                        ar: 'تم إرسال رسالتك بنجاح! سنعاود الاتصال بك قريبًا.',
                        zh: '您的消息已成功发送！我们会尽快与您联系。'
                    };
                    formMessage.textContent = messages[currentLang];
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                    
                    // Re-apply country code based on current language after reset
                    if (window.selectCountryByLang) {
                        window.selectCountryByLang(currentLang);
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                const currentLang = langSwitch.value;
                const errorMessages = {
                    tr: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
                    en: 'An error occurred while sending the message. Please try again.',
                    de: 'Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
                    fr: 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.',
                    es: 'Ocurrió un error al enviar el mensaje. Por favor, inténtelo de nuevo.',
                    ar: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
                    zh: '发送消息时出错。请重试。'
                };
                formMessage.textContent = errorMessages[currentLang];
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                const currentLang = langSwitch.value;
                const buttonTexts = {
                    tr: 'Gönder',
                    en: 'Send',
                    de: 'Senden',
                    fr: 'Envoyer',
                    es: 'Enviar',
                    ar: 'إرسال',
                    zh: '发送'
                };
                submitButton.textContent = buttonTexts[currentLang];
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // Country Code Selector with all countries
    const countries = [
        { code: '+93', flag: '🇦🇫', name: 'Afghanistan', lang: '' },
        { code: '+355', flag: '🇦🇱', name: 'Albania', lang: '' },
        { code: '+213', flag: '🇩🇿', name: 'Algeria', lang: '' },
        { code: '+376', flag: '🇦🇩', name: 'Andorra', lang: '' },
        { code: '+244', flag: '🇦🇴', name: 'Angola', lang: '' },
        { code: '+54', flag: '🇦🇷', name: 'Argentina', lang: '' },
        { code: '+374', flag: '🇦🇲', name: 'Armenia', lang: '' },
        { code: '+61', flag: '🇦🇺', name: 'Australia', lang: '' },
        { code: '+43', flag: '🇦🇹', name: 'Austria', lang: '' },
        { code: '+994', flag: '🇦🇿', name: 'Azerbaijan', lang: '' },
        { code: '+973', flag: '🇧🇭', name: 'Bahrain', lang: '' },
        { code: '+880', flag: '🇧🇩', name: 'Bangladesh', lang: '' },
        { code: '+375', flag: '🇧🇾', name: 'Belarus', lang: '' },
        { code: '+32', flag: '🇧🇪', name: 'Belgium', lang: '' },
        { code: '+501', flag: '🇧🇿', name: 'Belize', lang: '' },
        { code: '+229', flag: '🇧🇯', name: 'Benin', lang: '' },
        { code: '+975', flag: '🇧🇹', name: 'Bhutan', lang: '' },
        { code: '+591', flag: '🇧🇴', name: 'Bolivia', lang: '' },
        { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina', lang: '' },
        { code: '+267', flag: '🇧🇼', name: 'Botswana', lang: '' },
        { code: '+55', flag: '🇧🇷', name: 'Brazil', lang: '' },
        { code: '+673', flag: '🇧🇳', name: 'Brunei', lang: '' },
        { code: '+359', flag: '🇧🇬', name: 'Bulgaria', lang: '' },
        { code: '+226', flag: '🇧🇫', name: 'Burkina Faso', lang: '' },
        { code: '+257', flag: '🇧🇮', name: 'Burundi', lang: '' },
        { code: '+855', flag: '🇰🇭', name: 'Cambodia', lang: '' },
        { code: '+237', flag: '🇨🇲', name: 'Cameroon', lang: '' },
        { code: '+1', flag: '🇨🇦', name: 'Canada', lang: '' },
        { code: '+238', flag: '🇨🇻', name: 'Cape Verde', lang: '' },
        { code: '+236', flag: '🇨🇫', name: 'Central African Republic', lang: '' },
        { code: '+235', flag: '🇹🇩', name: 'Chad', lang: '' },
        { code: '+56', flag: '🇨🇱', name: 'Chile', lang: '' },
        { code: '+86', flag: '🇨🇳', name: 'China', lang: 'zh' },
        { code: '+57', flag: '🇨🇴', name: 'Colombia', lang: '' },
        { code: '+269', flag: '🇰🇲', name: 'Comoros', lang: '' },
        { code: '+242', flag: '🇨🇬', name: 'Congo', lang: '' },
        { code: '+506', flag: '🇨🇷', name: 'Costa Rica', lang: '' },
        { code: '+385', flag: '🇭🇷', name: 'Croatia', lang: '' },
        { code: '+53', flag: '🇨🇺', name: 'Cuba', lang: '' },
        { code: '+357', flag: '🇨🇾', name: 'Cyprus', lang: '' },
        { code: '+420', flag: '🇨🇿', name: 'Czech Republic', lang: '' },
        { code: '+45', flag: '🇩🇰', name: 'Denmark', lang: '' },
        { code: '+253', flag: '🇩🇯', name: 'Djibouti', lang: '' },
        { code: '+593', flag: '🇪🇨', name: 'Ecuador', lang: '' },
        { code: '+20', flag: '🇪🇬', name: 'Egypt', lang: '' },
        { code: '+503', flag: '🇸🇻', name: 'El Salvador', lang: '' },
        { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea', lang: '' },
        { code: '+291', flag: '🇪🇷', name: 'Eritrea', lang: '' },
        { code: '+372', flag: '🇪🇪', name: 'Estonia', lang: '' },
        { code: '+251', flag: '🇪🇹', name: 'Ethiopia', lang: '' },
        { code: '+679', flag: '🇫🇯', name: 'Fiji', lang: '' },
        { code: '+358', flag: '🇫🇮', name: 'Finland', lang: '' },
        { code: '+33', flag: '🇫🇷', name: 'France', lang: 'fr' },
        { code: '+241', flag: '🇬🇦', name: 'Gabon', lang: '' },
        { code: '+220', flag: '🇬🇲', name: 'Gambia', lang: '' },
        { code: '+995', flag: '🇬🇪', name: 'Georgia', lang: '' },
        { code: '+49', flag: '🇩🇪', name: 'Germany', lang: 'de' },
        { code: '+233', flag: '🇬🇭', name: 'Ghana', lang: '' },
        { code: '+30', flag: '🇬🇷', name: 'Greece', lang: '' },
        { code: '+502', flag: '🇬🇹', name: 'Guatemala', lang: '' },
        { code: '+224', flag: '🇬🇳', name: 'Guinea', lang: '' },
        { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau', lang: '' },
        { code: '+592', flag: '🇬🇾', name: 'Guyana', lang: '' },
        { code: '+509', flag: '🇭🇹', name: 'Haiti', lang: '' },
        { code: '+504', flag: '🇭🇳', name: 'Honduras', lang: '' },
        { code: '+852', flag: '🇭🇰', name: 'Hong Kong', lang: '' },
        { code: '+36', flag: '🇭🇺', name: 'Hungary', lang: '' },
        { code: '+354', flag: '🇮🇸', name: 'Iceland', lang: '' },
        { code: '+91', flag: '🇮🇳', name: 'India', lang: '' },
        { code: '+62', flag: '🇮🇩', name: 'Indonesia', lang: '' },
        { code: '+98', flag: '🇮🇷', name: 'Iran', lang: '' },
        { code: '+964', flag: '🇮🇶', name: 'Iraq', lang: '' },
        { code: '+353', flag: '🇮🇪', name: 'Ireland', lang: '' },
        { code: '+972', flag: '🇮🇱', name: 'Israel', lang: '' },
        { code: '+39', flag: '🇮🇹', name: 'Italy', lang: '' },
        { code: '+225', flag: '🇨🇮', name: 'Ivory Coast', lang: '' },
        { code: '+81', flag: '🇯🇵', name: 'Japan', lang: '' },
        { code: '+962', flag: '🇯🇴', name: 'Jordan', lang: '' },
        { code: '+7', flag: '🇰🇿', name: 'Kazakhstan', lang: '' },
        { code: '+254', flag: '🇰🇪', name: 'Kenya', lang: '' },
        { code: '+965', flag: '🇰🇼', name: 'Kuwait', lang: '' },
        { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan', lang: '' },
        { code: '+856', flag: '🇱🇦', name: 'Laos', lang: '' },
        { code: '+371', flag: '🇱🇻', name: 'Latvia', lang: '' },
        { code: '+961', flag: '🇱🇧', name: 'Lebanon', lang: '' },
        { code: '+266', flag: '🇱🇸', name: 'Lesotho', lang: '' },
        { code: '+231', flag: '🇱🇷', name: 'Liberia', lang: '' },
        { code: '+218', flag: '🇱🇾', name: 'Libya', lang: '' },
        { code: '+423', flag: '🇱🇮', name: 'Liechtenstein', lang: '' },
        { code: '+370', flag: '🇱🇹', name: 'Lithuania', lang: '' },
        { code: '+352', flag: '🇱🇺', name: 'Luxembourg', lang: '' },
        { code: '+853', flag: '🇲🇴', name: 'Macau', lang: '' },
        { code: '+389', flag: '🇲🇰', name: 'North Macedonia', lang: '' },
        { code: '+261', flag: '🇲🇬', name: 'Madagascar', lang: '' },
        { code: '+265', flag: '🇲🇼', name: 'Malawi', lang: '' },
        { code: '+60', flag: '🇲🇾', name: 'Malaysia', lang: '' },
        { code: '+960', flag: '🇲🇻', name: 'Maldives', lang: '' },
        { code: '+223', flag: '🇲🇱', name: 'Mali', lang: '' },
        { code: '+356', flag: '🇲🇹', name: 'Malta', lang: '' },
        { code: '+222', flag: '🇲🇷', name: 'Mauritania', lang: '' },
        { code: '+230', flag: '🇲🇺', name: 'Mauritius', lang: '' },
        { code: '+52', flag: '🇲🇽', name: 'Mexico', lang: '' },
        { code: '+373', flag: '🇲🇩', name: 'Moldova', lang: '' },
        { code: '+377', flag: '🇲🇨', name: 'Monaco', lang: '' },
        { code: '+976', flag: '🇲🇳', name: 'Mongolia', lang: '' },
        { code: '+382', flag: '🇲🇪', name: 'Montenegro', lang: '' },
        { code: '+212', flag: '🇲🇦', name: 'Morocco', lang: '' },
        { code: '+258', flag: '🇲🇿', name: 'Mozambique', lang: '' },
        { code: '+95', flag: '🇲🇲', name: 'Myanmar', lang: '' },
        { code: '+264', flag: '🇳🇦', name: 'Namibia', lang: '' },
        { code: '+977', flag: '🇳🇵', name: 'Nepal', lang: '' },
        { code: '+31', flag: '🇳🇱', name: 'Netherlands', lang: '' },
        { code: '+64', flag: '🇳🇿', name: 'New Zealand', lang: '' },
        { code: '+505', flag: '🇳🇮', name: 'Nicaragua', lang: '' },
        { code: '+227', flag: '🇳🇪', name: 'Niger', lang: '' },
        { code: '+234', flag: '🇳🇬', name: 'Nigeria', lang: '' },
        { code: '+850', flag: '🇰🇵', name: 'North Korea', lang: '' },
        { code: '+47', flag: '🇳🇴', name: 'Norway', lang: '' },
        { code: '+968', flag: '🇴🇲', name: 'Oman', lang: '' },
        { code: '+92', flag: '🇵🇰', name: 'Pakistan', lang: '' },
        { code: '+507', flag: '🇵🇦', name: 'Panama', lang: '' },
        { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea', lang: '' },
        { code: '+595', flag: '🇵🇾', name: 'Paraguay', lang: '' },
        { code: '+51', flag: '🇵🇪', name: 'Peru', lang: '' },
        { code: '+63', flag: '🇵🇭', name: 'Philippines', lang: '' },
        { code: '+48', flag: '🇵🇱', name: 'Poland', lang: '' },
        { code: '+351', flag: '🇵🇹', name: 'Portugal', lang: '' },
        { code: '+974', flag: '🇶🇦', name: 'Qatar', lang: '' },
        { code: '+40', flag: '🇷🇴', name: 'Romania', lang: '' },
        { code: '+7', flag: '🇷🇺', name: 'Russia', lang: '' },
        { code: '+250', flag: '🇷🇼', name: 'Rwanda', lang: '' },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', lang: 'ar' },
        { code: '+221', flag: '🇸🇳', name: 'Senegal', lang: '' },
        { code: '+381', flag: '🇷🇸', name: 'Serbia', lang: '' },
        { code: '+248', flag: '🇸🇨', name: 'Seychelles', lang: '' },
        { code: '+232', flag: '🇸🇱', name: 'Sierra Leone', lang: '' },
        { code: '+65', flag: '🇸🇬', name: 'Singapore', lang: '' },
        { code: '+421', flag: '🇸🇰', name: 'Slovakia', lang: '' },
        { code: '+386', flag: '🇸🇮', name: 'Slovenia', lang: '' },
        { code: '+252', flag: '🇸🇴', name: 'Somalia', lang: '' },
        { code: '+27', flag: '🇿🇦', name: 'South Africa', lang: '' },
        { code: '+82', flag: '🇰🇷', name: 'South Korea', lang: '' },
        { code: '+211', flag: '🇸🇸', name: 'South Sudan', lang: '' },
        { code: '+34', flag: '🇪🇸', name: 'Spain', lang: 'es' },
        { code: '+94', flag: '🇱🇰', name: 'Sri Lanka', lang: '' },
        { code: '+249', flag: '🇸🇩', name: 'Sudan', lang: '' },
        { code: '+597', flag: '🇸🇷', name: 'Suriname', lang: '' },
        { code: '+268', flag: '🇸🇿', name: 'Eswatini', lang: '' },
        { code: '+46', flag: '🇸🇪', name: 'Sweden', lang: '' },
        { code: '+41', flag: '🇨🇭', name: 'Switzerland', lang: '' },
        { code: '+963', flag: '🇸🇾', name: 'Syria', lang: '' },
        { code: '+886', flag: '🇹🇼', name: 'Taiwan', lang: '' },
        { code: '+992', flag: '🇹🇯', name: 'Tajikistan', lang: '' },
        { code: '+255', flag: '🇹🇿', name: 'Tanzania', lang: '' },
        { code: '+66', flag: '🇹🇭', name: 'Thailand', lang: '' },
        { code: '+228', flag: '🇹🇬', name: 'Togo', lang: '' },
        { code: '+216', flag: '🇹🇳', name: 'Tunisia', lang: '' },
        { code: '+90', flag: '🇹🇷', name: 'Turkey', lang: 'tr' },
        { code: '+993', flag: '🇹🇲', name: 'Turkmenistan', lang: '' },
        { code: '+256', flag: '🇺🇬', name: 'Uganda', lang: '' },
        { code: '+380', flag: '🇺🇦', name: 'Ukraine', lang: '' },
        { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates', lang: '' },
        { code: '+44', flag: '🇬🇧', name: 'United Kingdom', lang: 'en' },
        { code: '+1', flag: '🇺🇸', name: 'United States', lang: '' },
        { code: '+598', flag: '🇺🇾', name: 'Uruguay', lang: '' },
        { code: '+998', flag: '🇺🇿', name: 'Uzbekistan', lang: '' },
        { code: '+678', flag: '🇻🇺', name: 'Vanuatu', lang: '' },
        { code: '+58', flag: '🇻🇪', name: 'Venezuela', lang: '' },
        { code: '+84', flag: '🇻🇳', name: 'Vietnam', lang: '' },
        { code: '+967', flag: '🇾🇪', name: 'Yemen', lang: '' },
        { code: '+260', flag: '🇿🇲', name: 'Zambia', lang: '' },
        { code: '+263', flag: '🇿🇼', name: 'Zimbabwe', lang: '' }
    ];

    const countryCodeDisplay = document.getElementById('countryCodeDisplay');
    const countryCodeDropdown = document.getElementById('countryCodeDropdown');
    const countrySearch = document.getElementById('countrySearch');
    const countryList = document.getElementById('countryList');
    const countryCodeInput = document.getElementById('countryCode');
    
    if (countryCodeDisplay && countryCodeDropdown && countryList) {
        // Populate country list
        function populateCountryList(filter = '') {
            const filteredCountries = countries.filter(country => 
                country.name.toLowerCase().includes(filter.toLowerCase()) ||
                country.code.includes(filter)
            );
            
            countryList.innerHTML = '';
            filteredCountries.forEach(country => {
                const option = document.createElement('div');
                option.className = 'country-option';
                option.innerHTML = `${country.flag} ${country.name} ${country.code}`;
                option.dataset.code = country.code;
                option.dataset.flag = country.flag;
                option.dataset.lang = country.lang;
                
                if (countryCodeInput.value === country.code) {
                    option.classList.add('selected');
                }
                
                option.addEventListener('click', () => {
                    selectCountry(country.code, country.flag);
                    closeDropdown();
                });
                
                countryList.appendChild(option);
            });
        }
        
        function selectCountry(code, flag) {
            countryCodeInput.value = code;
            document.querySelector('.selected-country').textContent = `${flag} ${code}`;
            
            // Update selected state
            document.querySelectorAll('.country-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.dataset.code === code) {
                    opt.classList.add('selected');
                }
            });
        }
        
        function closeDropdown() {
            countryCodeDropdown.classList.remove('active');
            countryCodeDisplay.classList.remove('active');
            countrySearch.value = '';
            populateCountryList();
        }
        
        // Toggle dropdown
        countryCodeDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = countryCodeDropdown.classList.toggle('active');
            countryCodeDisplay.classList.toggle('active');
            
            if (isActive) {
                populateCountryList();
                countrySearch.focus();
            }
        });
        
        // Search functionality
        countrySearch.addEventListener('input', (e) => {
            populateCountryList(e.target.value);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!countryCodeDisplay.contains(e.target) && !countryCodeDropdown.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Prevent dropdown close when clicking inside dropdown
        countryCodeDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Expose function to update country code based on language
        window.selectCountryByLang = function(lang) {
            const country = countries.find(c => c.lang === lang);
            if (country) {
                selectCountry(country.code, country.flag);
            }
        };
        
        // Initialize
        populateCountryList();
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
