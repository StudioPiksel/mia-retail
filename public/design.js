(function () {
    'use strict';

    function initStripReveal() {
        var strips = Array.prototype.slice.call(
            document.querySelectorAll('.design-strip')
        );
        if (!strips.length) return;
        if (!('IntersectionObserver' in window)) {
            strips.forEach(function (s) { s.classList.add('is-visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        strips.forEach(function (s) { io.observe(s); });
    }

    function init() {
        initStripReveal();

        var items = Array.prototype.slice.call(
            document.querySelectorAll('.studio-item')
        );
        if (!items.length) return;

        // Build the flat list of {src, caption} from all studio items
        var slides = items.map(function (el) {
            var img = el.querySelector('img');
            return {
                src: img ? img.getAttribute('src') : '',
                caption: el.getAttribute('data-caption') || (img ? img.getAttribute('alt') : '')
            };
        });

        // Create lightbox DOM
        var lb = document.createElement('div');
        lb.className = 'design-lightbox';
        lb.innerHTML =
            '<button class="dl-close" aria-label="Zatvori">&times;</button>' +
            '<button class="dl-prev" aria-label="Prethodna">&#8249;</button>' +
            '<img alt="">' +
            '<button class="dl-next" aria-label="Sljedeća">&#8250;</button>' +
            '<div class="dl-caption"></div>';
        document.body.appendChild(lb);

        var lbImg = lb.querySelector('img');
        var lbCaption = lb.querySelector('.dl-caption');
        var current = 0;

        function show(i) {
            current = (i + slides.length) % slides.length;
            lbImg.src = slides[current].src;
            lbImg.alt = slides[current].caption;
            lbCaption.textContent = slides[current].caption;
        }

        function open(i) {
            show(i);
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lb.classList.remove('open');
            document.body.style.overflow = '';
        }

        items.forEach(function (el, i) {
            el.addEventListener('click', function () { open(i); });
        });

        lb.querySelector('.dl-close').addEventListener('click', close);
        lb.querySelector('.dl-prev').addEventListener('click', function (e) {
            e.stopPropagation();
            show(current - 1);
        });
        lb.querySelector('.dl-next').addEventListener('click', function (e) {
            e.stopPropagation();
            show(current + 1);
        });
        lb.addEventListener('click', function (e) {
            if (e.target === lb) close();
        });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(current - 1);
            else if (e.key === 'ArrowRight') show(current + 1);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

