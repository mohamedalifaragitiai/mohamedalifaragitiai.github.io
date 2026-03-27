$(document).ready(function () {

    // Mobile menu toggle
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('header').toggleClass('toggle');
    });

    // Close menu on scroll
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('header').removeClass('toggle');

        // Scroll top button
        if ($(this).scrollTop() > 300) {
            $('#scroll-top').addClass('active');
        } else {
            $('#scroll-top').removeClass('active');
        }

        // Active nav link on scroll
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
    });

    // Smooth scroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 50
            }, 600);
        }
    });

    // Project filter
    $('.filter-btn').click(function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        var filter = $(this).data('filter');

        $('.project-card').each(function () {
            if (filter === 'all') {
                $(this).fadeIn(300);
            } else {
                var categories = $(this).data('category');
                if (categories && categories.indexOf(filter) !== -1) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            }
        });
    });

    // Animate elements on scroll
    function animateOnScroll() {
        var elements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .contact-card, .honor-item');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    animateOnScroll();

    // Typed effect for tagline
    var tagline = document.querySelector('.tagline');
    if (tagline) {
        var text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.visibility = 'visible';
        var i = 0;
        function typeWriter() {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 500);
    }
});
