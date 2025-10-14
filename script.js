// Retro Website JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Video Player Functionality
    const video = document.getElementById('mainVideo');
    const playButton = document.getElementById('playButton'); // optional
    const playPauseBtn = document.getElementById('playPauseBtn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const progressFill = document.getElementById('progressFill');
    const progressBar = document.getElementById('progressBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const videoOverlay = document.querySelector('.video-overlay'); // optional
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Playlist of local mp4 files (relative to the project root)
    const playlist = [
        'img/Gregoire Akcelrod impresses Swindon\'s fans.mp4',
        'img/Gregoire Akcelrod vs Capital City (Away) - 25.09.2011.mp4',
        'img/Gregoire Akcelrod - Soccer Skills.mp4'
    ];
    let currentIndex = 0;

    // Play/Pause functionality (safe checks)
    function togglePlayPause() {
        if (!video) return;
        if (video.paused || video.ended) {
            video.play();
            if (playButton) playButton.style.display = 'none';
            if (videoOverlay) videoOverlay.style.display = 'none';
            if (playPauseBtn) playPauseBtn.textContent = '⏸';
        } else {
            video.pause();
            if (playButton) playButton.style.display = 'block';
            if (videoOverlay) videoOverlay.style.display = 'flex';
            if (playPauseBtn) playPauseBtn.textContent = '▶';
        }
    }

    // Event listeners for video controls (add only if elements exist)
    if (playButton) playButton.addEventListener('click', togglePlayPause);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (videoOverlay) videoOverlay.addEventListener('click', togglePlayPause);
    if (rewindBtn) rewindBtn.addEventListener('click', function() {
        if (!video) return;
        video.currentTime = Math.max(0, video.currentTime - 10);
    });
    if (forwardBtn) forwardBtn.addEventListener('click', function() {
        if (!video) return;
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
    });
    if (nextBtn && video) nextBtn.addEventListener('click', function() {
        // advance to next file in playlist
        if (playlist.length === 0) return;
        currentIndex = (currentIndex + 1) % playlist.length;
        const nextSrc = playlist[currentIndex];
        // change source and play
        const source = video.querySelector('source');
        if (source) {
            source.src = nextSrc;
            video.load();
            video.play().catch(err => console.warn('Play prevented:', err));
        } else {
            // fallback: set video.src
            video.src = nextSrc;
            video.load();
            video.play().catch(err => console.warn('Play prevented:', err));
        }
    });
    if (prevBtn && video) prevBtn.addEventListener('click', function() {
        // advance to next file in playlist
        if (playlist.length === 0) return;
        currentIndex = (currentIndex + 1) % playlist.length;
        const nextSrc = playlist[currentIndex];
        // change source and play
        const source = video.querySelector('source');
        if (source) {
            source.src = nextSrc;
            video.load();
            video.play().catch(err => console.warn('Play prevented:', err));
        } else {
            // fallback: set video.src
            video.src = nextSrc;
            video.load();
            video.play().catch(err => console.warn('Play prevented:', err));
        }
    });
    // pauseBtn just pauses
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn && video) pauseBtn.addEventListener('click', function() { video.pause(); });

    // Update progress bar and time display
    if (video) {
        video.addEventListener('timeupdate', function() {
            if (video.duration && progressFill) {
                const progress = (video.currentTime / video.duration) * 100;
                progressFill.style.width = progress + '%';
            }
            if (timeDisplay) {
                const currentTime = formatTime(video.currentTime || 0);
                const duration = formatTime(video.duration || 0);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        video.addEventListener('loadedmetadata', function() {
            if (timeDisplay) {
                timeDisplay.textContent = `${formatTime(video.currentTime || 0)} / ${formatTime(video.duration || 0)}`;
            }
        });
        // Update UI on play/pause/ended
        video.addEventListener('play', function() {
            if (playPauseBtn) playPauseBtn.textContent = '⏸';
        });
        video.addEventListener('pause', function() {
            if (playPauseBtn) playPauseBtn.textContent = '▶';
        });
        video.addEventListener('ended', function() {
            if (playPauseBtn) playPauseBtn.textContent = '▶';
            if (progressFill) progressFill.style.width = '0%';
        });
    }

    // Click/drag on progress bar to seek
    if (progressBar && video) {
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            if (video.duration) video.currentTime = percentage * video.duration;
        });

        // basic dragging support
        let isDragging = false;
        progressBar.addEventListener('mousedown', function(e) { isDragging = true; seek(e); });
        window.addEventListener('mousemove', function(e) { if (isDragging) seek(e); });
        window.addEventListener('mouseup', function() { isDragging = false; });

        function seek(e) {
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            if (video.duration) video.currentTime = percentage * video.duration;
        }
    }

    // Format time helper function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // If link is an internal anchor or '#', handle it here; otherwise allow normal navigation
            if (!href || href === '#' || href.startsWith('#')) {
                e.preventDefault();

                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');

                // Add retro click effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
            // otherwise do nothing and let the browser navigate to the href (same tab)
        });
    });

    // Add retro hover effects to navigation
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Auto-highlight active nav link based on current path
    (function setActiveNavByPath() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            // normalize
            const linkPath = href.split('/').pop();
            if (linkPath === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    })();

    // Statistics animation on load
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 30; // Animation duration
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, 50);
    });

    // Add retro loading animation
    function addRetroEffects() {
        // Subtle glow effect for the video player (kept)
        const videoPlayer = document.querySelector('.video-player');
        if (videoPlayer) {
            setInterval(() => {
                videoPlayer.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)';
                setTimeout(() => {
                    videoPlayer.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.3)';
                }, 1000);
            }, 3000);
        }
    }

    // Initialize retro effects
    addRetroEffects();

    // Fade-in helper removed (not used)

    // Add keyboard shortcuts for video player
    document.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                break;
        }
    });

    // Click sound effects removed (no audio assets)

    // Retro loading screen removed

    // Retro scroll effects removed

    // Add retro particle effect (simple version)
    function createRetroParticles() {
        const particleCount = 20;
        // Insert keyframes once
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) translateX(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: #60A5FA;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                animation: float 6s infinite linear;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
            `;
            document.body.appendChild(particle);
        }
    }

    // Initialize particles
    createRetroParticles();

    console.log('🎮 Gregoire Akcelrod Retro Website Loaded Successfully!');
    console.log('⚽ Welcome to the official PSG player website');
    console.log('🎯 Use spacebar to play/pause video, arrow keys to seek');
});
