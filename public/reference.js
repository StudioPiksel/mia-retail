document.addEventListener('DOMContentLoaded', () => {
    const brands = window.MIA_BRANDS || [];

    // 1. FILTERING
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.brand-card');
    const emptyMsg = document.getElementById('galleryEmpty');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            let visibleCount = 0;

            cards.forEach(card => {
                const show = (filter === 'all') || card.classList.contains(filter);
                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
        });
    });

    // 2. LIGHTBOX (per-brand gallery)
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentBrand = null;
    let currentImgIndex = 0;

    function openLightbox(brandIndex) {
        currentBrand = brands[brandIndex];
        if (!currentBrand) return;
        currentImgIndex = 0;
        updateLightbox();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        toggleNavArrows();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function toggleNavArrows() {
        const multi = currentBrand && currentBrand.imgs.length > 1;
        prevBtn.style.display = multi ? '' : 'none';
        nextBtn.style.display = multi ? '' : 'none';
    }

    function updateLightbox() {
        if (!currentBrand) return;
        const total = currentBrand.imgs.length;
        const src = currentBrand.imgs[currentImgIndex];
        lightboxImg.src = src;
        lightboxImg.alt = currentBrand.name + ' — ' + currentBrand.country;
        const counter = total > 1 ? ` <span class="lb-counter">(${currentImgIndex + 1}/${total})</span>` : '';
        lightboxCaption.innerHTML = `<strong>${currentBrand.name}</strong> &middot; ${currentBrand.country}${counter}`;
    }

    function showNext() {
        if (!currentBrand) return;
        currentImgIndex = (currentImgIndex + 1) % currentBrand.imgs.length;
        updateLightbox();
    }

    function showPrev() {
        if (!currentBrand) return;
        currentImgIndex = (currentImgIndex - 1 + currentBrand.imgs.length) % currentBrand.imgs.length;
        updateLightbox();
    }

    cards.forEach(card => {
        const idx = parseInt(card.getAttribute('data-brand-index'), 10);
        card.addEventListener('click', () => openLightbox(idx));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
