/* Portfolio interactions - vanilla JS, no dependencies */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

    // ===== PRELOADER =====
    var preloader = $('#preloader');
    function hidePreloader() {
        if (!preloader) return;
        preloader.classList.add('loaded');
        setTimeout(function () {
            if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 600);
    }
    window.addEventListener('load', function () {
        setTimeout(hidePreloader, 800);
    });
    // Fallback: never let the preloader trap the page
    setTimeout(hidePreloader, 3000);

    // ===== PARTICLES CANVAS =====
    var canvas = document.getElementById('particles-canvas');
    if (canvas && !reduceMotion) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null, radius: 150 };
        var running = false;
        var rafId = null;
        var LINK_DIST = 120;
        var LINK_DIST_SQ = LINK_DIST * LINK_DIST;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        }

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
                var distSq = dx * dx + dy * dy;
                if (distSq < mouse.radius * mouse.radius) {
                    var dist = Math.sqrt(distSq);
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
            for (var i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var distSq = dx * dx + dy * dy;
                    if (distSq < LINK_DIST_SQ) {
                        var opacity = (1 - Math.sqrt(distSq) / LINK_DIST) * 0.15;
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
            rafId = requestAnimationFrame(animateParticles);
        }

        function startParticles() {
            if (running) return;
            running = true;
            rafId = requestAnimationFrame(animateParticles);
        }

        function stopParticles() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        }

        resizeCanvas();
        window.addEventListener('resize', debounce(resizeCanvas, 200));

        // Only burn frames while the canvas is actually on screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries[0].isIntersecting ? startParticles() : stopParticles();
            }, { threshold: 0 }).observe(canvas);
        } else {
            startParticles();
        }

        document.addEventListener('visibilitychange', function () {
            document.hidden ? stopParticles() : startParticles();
        });
    }

    // ===== TYPEWRITER EFFECT =====
    var roles = [
        'Senior GenAI Engineer',
        'AI Architect',
        'Multi-Agent Systems Expert',
        'MLOps Engineer',
        'RAG & LLM Specialist',
        'Full-Stack AI Developer',
        'AI/GenAI & Data Science Lecturer'
    ];
    var typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        if (reduceMotion) {
            typewriterEl.textContent = roles[0];
        } else {
            var roleIndex = 0;
            var charIndex = 0;
            var isDeleting = false;

            var typeEffect = function () {
                if (document.hidden) { setTimeout(typeEffect, 500); return; }

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
            };
            setTimeout(typeEffect, 1000);
        }
    }

    // ===== COUNTER ANIMATION (observer-driven) =====
    var counters = $$('.counter');
    if (counters.length) {
        var runCounters = function () {
            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                if (reduceMotion) { counter.textContent = target; return; }

                var duration = 1500;
                var startTime = null;
                var step = function (timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                    else counter.textContent = target;
                };
                requestAnimationFrame(step);
            });
        };

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries, obs) {
                if (entries.some(function (e) { return e.isIntersecting; })) {
                    runCounters();
                    obs.disconnect();
                }
            }, { threshold: 0.2 });
            counterObserver.observe(counters[0].closest('.stats-bar') || counters[0]);
        } else {
            runCounters();
        }
    }

    // ===== MOBILE MENU =====
    var menuBtn = document.getElementById('menu');
    var header = document.querySelector('header');
    if (menuBtn && header) {
        menuBtn.addEventListener('click', function () {
            menuBtn.classList.toggle('fa-times');
            header.classList.toggle('toggle');
        });
    }

    // ===== SCROLL EVENTS (rAF-throttled, cached offsets) =====
    var scrollTopBtn = document.getElementById('scroll-top');
    var navLinks = $$('nav a');
    var sections = $$('section[id]');
    var sectionBounds = [];

    function measureSections() {
        var pageY = window.pageYOffset;
        sectionBounds = sections.map(function (section) {
            var rect = section.getBoundingClientRect();
            return { id: section.id, top: rect.top + pageY - 150, height: rect.height };
        });
    }

    var activeId = null;
    function onScroll() {
        var y = window.pageYOffset;

        if (menuBtn) menuBtn.classList.remove('fa-times');
        if (header) header.classList.remove('toggle');

        if (scrollTopBtn) scrollTopBtn.classList.toggle('active', y > 300);

        for (var i = 0; i < sectionBounds.length; i++) {
            var s = sectionBounds[i];
            if (y >= s.top && y < s.top + s.height) {
                if (activeId !== s.id) {
                    activeId = s.id;
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + s.id);
                    });
                }
                break;
            }
        }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            onScroll();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', debounce(function () {
        measureSections();
        onScroll();
    }, 200));

    window.addEventListener('load', function () {
        measureSections();
        onScroll();
    });
    measureSections();
    onScroll();

    // ===== SMOOTH SCROLL (native) =====
    $$('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - 50,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        });
    });

    // ===== PROJECT FILTER =====
    var filterBtns = $$('.filter-btn');
    var projectCards = $$('.project-card');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');
            projectCards.forEach(function (card) {
                var categories = card.getAttribute('data-category') || '';
                var show = filter === 'all' || categories.indexOf(filter) !== -1;
                card.classList.toggle('hidden', !show);
                card.classList.toggle('show', show);
            });
            measureSections();
        });
    });

    // ===== REVEAL ANIMATIONS =====
    var revealSelector = '.timeline-item, .project-card, .skill-category, .contact-card, .honor-item, .edu-card, .volunteer-item';
    var revealTargets = $$(revealSelector);
    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var delay = Array.prototype.indexOf.call(
                    entry.target.parentElement.children, entry.target
                ) * 100;
                setTimeout(function () {
                    entry.target.classList.add('animate');
                }, delay);
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.08 });
        revealTargets.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealTargets.forEach(function (el) { el.classList.add('animate'); });
    }

    // ===== CARD GLOW FOLLOW MOUSE (pointer devices only) =====
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        $$('.glass-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
            }, { passive: true });
        });
    }

    function debounce(fn, wait) {
        var t;
        return function () {
            var args = arguments, self = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(self, args); }, wait);
        };
    }
})();
