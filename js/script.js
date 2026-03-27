$(document).ready(function () {

    // ===== PRELOADER =====
    $(window).on('load', function () {
        setTimeout(function () {
            $('#preloader').addClass('loaded');
            setTimeout(function () {
                $('#preloader').remove();
            }, 600);
        }, 800);
    });

    // Fallback: remove preloader after 3s
    setTimeout(function () {
        $('#preloader').addClass('loaded');
    }, 3000);

    // ===== PARTICLES CANVAS =====
    var canvas = document.getElementById('particles-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                var dx = mouse.x - this.x;
                var dy = mouse.y - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    var force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        };

        Particle.prototype.draw = function () {
            ctx.fillStyle = 'rgba(108, 99, 255, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };

        function initParticles() {
            particles = [];
            var count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
            for (var i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        var opacity = (1 - dist / 120) * 0.15;
                        ctx.strokeStyle = 'rgba(108, 99, 255, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ===== TYPEWRITER EFFECT =====
    var roles = [
        'Senior GenAI Engineer',
        'AI Architect',
        'Multi-Agent Systems Expert',
        'MLOps Engineer',
        'RAG & LLM Specialist',
        'Full-Stack AI Developer'
    ];
    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typewriterEl = document.getElementById('typewriter');

    function typeEffect() {
        if (!typewriterEl) return;
        var currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        var speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 300;
        }

        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1000);

    // ===== COUNTER ANIMATION =====
    var countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        var counters = document.querySelectorAll('.counter');
        var allVisible = false;

        counters.forEach(function (counter) {
            var rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                allVisible = true;
            }
        });

        if (allVisible) {
            countersAnimated = true;
            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-target'));
                var duration = 1500;
                var start = 0;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(step);
            });
        }
    }

    // ===== MOBILE MENU =====
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('header').toggleClass('toggle');
    });

    // ===== SCROLL EVENTS =====
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('header').removeClass('toggle');

        // Scroll top button
        if ($(this).scrollTop() > 300) {
            $('#scroll-top').addClass('active');
        } else {
            $('#scroll-top').removeClass('active');
        }

        // Active nav link
        $('section').each(function () {
            var top = $(window).scrollTop();
            var offset = $(this).offset().top - 150;
            var height = $(this).height();
            var id = $(this).attr('id');

            if (top >= offset && top < offset + height) {
                $('nav a').removeClass('active');
                $('nav a[href="#' + id + '"]').addClass('active');
            }
        });

        animateCounters();
    });

    // ===== SMOOTH SCROLL =====
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 50
            }, 600, 'swing');
        }
    });

    // ===== PROJECT FILTER =====
    $('.filter-btn').click(function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        var filter = $(this).data('filter');

        $('.project-card').each(function () {
            var $card = $(this);
            if (filter === 'all') {
                $card.removeClass('hidden');
                $card.addClass('show');
            } else {
                var categories = $card.data('category');
                if (categories && categories.indexOf(filter) !== -1) {
                    $card.removeClass('hidden');
                    $card.addClass('show');
                } else {
                    $card.removeClass('show');
                    $card.addClass('hidden');
                }
            }
        });
    });

    // ===== INTERSECTION OBSERVER ANIMATIONS =====
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                // Stagger the animation
                var delay = Array.prototype.indexOf.call(
                    entry.target.parentElement.children,
                    entry.target
                ) * 100;
                setTimeout(function () {
                    entry.target.classList.add('animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.timeline-item, .project-card, .skill-category, .contact-card, .honor-item, .edu-card, .volunteer-item').forEach(function (el) {
        observer.observe(el);
    });

    // ===== CARD GLOW FOLLOW MOUSE =====
    document.querySelectorAll('.glass-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
});
