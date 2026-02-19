$(document).ready(function () {

    // --------------------------------------------------------------------------
    // Canvas Particles Animation
    // --------------------------------------------------------------------------
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    let particlesArray;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle resize
    $(window).on('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Mouse interaction
    const mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 80) * (canvas.width / 80)
    };

    $(window).on('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    $(window).on('mouseout', function () {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check boundary
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Check mouse collision
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Init Particles
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2; // Slow particle speed
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = '#3a7bd5'; // Particle Color

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // Draw lines between particles
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(58, 123, 213,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animate();


    // --------------------------------------------------------------------------
    // Typing Effect
    // --------------------------------------------------------------------------
    const typeWords = ["Full Stack Developer", "Software Engineer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = typeWords[wordIndex];
        const $typeSpan = $(".type-span");

        if (isDeleting) {
            $typeSpan.text(currentWord.substring(0, charIndex - 1));
            charIndex--;
            typeSpeed = 50;
        } else {
            $typeSpan.text(currentWord.substring(0, charIndex + 1));
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typeWords.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();


    // --------------------------------------------------------------------------
    // Sticky Navbar & Active Link
    // --------------------------------------------------------------------------
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('sticky');
        } else {
            $('.navbar').removeClass('sticky');
        }

        // Active Link Highlight
        var scrollPos = $(document).scrollTop();
        $('.nav-links a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));

            if (refElement.length) {
                if (refElement.position().top - 100 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                    $('.nav-links a').removeClass("active");
                    currLink.addClass("active");
                }
            }
        });
    });


    // --------------------------------------------------------------------------
    // Mobile Menu Toggle
    // --------------------------------------------------------------------------
    $('.hamburger').click(function () {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('open'); // Optional: Add class for hamburger animation if you add CSS
    });

    $('.nav-links a').click(function () {
        if ($(window).width() <= 768) {
            $('.nav-links').removeClass('active');
        }
    });


    // --------------------------------------------------------------------------
    // Scroll Reveal Animation (Intersection Observer with fallback loop)
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.fade-in, .slide-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger Skill Bars if active
                if ($(entry.target).find('.progress-line').length > 0) {
                    // Logic handled below specifically for skills
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --------------------------------------------------------------------------
    // Skill Bar Animation (Trigger when skill section is visible)
    // --------------------------------------------------------------------------
    const skillsSection = document.querySelector('#skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $('.progress-line span').each(function () {
                    const value = $(this).parent().prev().find('span:last-child').text();
                    $(this).css('width', value);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) skillsObserver.observe(skillsSection);


    // --------------------------------------------------------------------------
    // Contact Form Handling (WhatsApp Integration)
    // --------------------------------------------------------------------------
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const message = $('#message').val();
        const phoneNumber = "919727928052"; // Your WhatsApp number

        if (name && email && message) {
            // Button Loading State
            const btn = $(this).find('button');
            const originalText = btn.html();
            btn.html('<i class="fab fa-whatsapp"></i> Sending...');

            // Construct WhatsApp URL
            const text = `*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${message}`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`; // Removed encodeURIComponent for manual construction above to ensure newlines work

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Reset Form UI
            setTimeout(function () {
                $('#formStatus').html('<span style="color: #00d2ff;"><i class="fas fa-check-circle"></i> Redirecting to WhatsApp...</span>').fadeIn();
                $('#contactForm')[0].reset();
                btn.html(originalText);

                setTimeout(() => { $('#formStatus').fadeOut(); }, 5000);
            }, 1000);
        }
    });

});
