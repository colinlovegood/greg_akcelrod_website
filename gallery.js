// Simple gallery logic: thumbnails + main image + prev/next
(function(){
  const images = [
    'img/images-8.jpeg',
    'img/63749688394415-2.jpg',
    'img/greg photo.jpeg',
    'img/cilqurylzqtqruli.jpg',
    'img/mqdefault.jpg',
    'img/i2zbkdq8negxenxd.jpg',
    'img/39248066-9254093-akcelrod-right-was-offered-a-transfer-by-then-champions-league-c-a-8-1613305118873.jpg.webp',
    'img/39305964-9254093-cska-sofia-announced-ackelrod-s-transfer-and-took-official-photo-a-1-1613643372615.jpg.webp',
    'img/lpsmepxtizw6zi6p.jpg',
    'img/SR57996.jpg',
    'img/simak_kisah_unik_greg_akcelrod_yang_nyaris_menipu_tim_raksasa_liga_champions-bWGd_large.jpg',

  ];

  let current = 0;
  const mainPhoto = document.getElementById('mainPhoto');
  const thumbsRow = document.getElementById('thumbsRow');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function renderThumbnails() {
    thumbsRow.innerHTML = '';
    images.forEach((src, idx) => {
      const btn = document.createElement('button');
      btn.className = 'thumb-btn';
      btn.setAttribute('data-index', idx);
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'thumb-' + idx;
      img.className = 'thumb-image';
      btn.appendChild(img);
      btn.addEventListener('click', () => {
        goTo(idx);
      });
      thumbsRow.appendChild(btn);
    });
  }

  function updateMain() {
    mainPhoto.src = images[current];
    // update active thumbnail
    document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector('.thumb-btn[data-index="' + current + '"]');
    if (activeBtn) activeBtn.classList.add('active');
  }

  function goTo(idx) {
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    current = idx;
    updateMain();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  renderThumbnails();
  updateMain();
})();
