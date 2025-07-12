document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Audio elements and controls
    const playPauseBtn = document.getElementById('play-pause-btn');
    const miniPlayPauseBtn = document.getElementById('mini-play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const miniNextBtn = document.getElementById('mini-next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const seekbar = document.getElementById('seekbar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const totalTimeSpan = document.getElementById('total-time');

    // Song info elements
    const currentAlbumArt = document.getElementById('current-album-art');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentArtistName = document.getElementById('current-artist-name');
    const miniAlbumArt = document.getElementById('mini-album-art');
    const miniSongTitle = document.getElementById('mini-song-title');
    const miniArtistName = document.getElementById('mini-artist-name');

    // Dummy song list (replace with actual data later)
    const songs = [
        {
            title: "Neon Dreams",
            artist: "CyberSynth",
            src: "1.mp3", // You need to have 1.mp3, 2.mp3, etc. in your directory
            albumArt: "1.jpg"
        },
        {
            title: "Future Echoes",
            artist: "AuraWave",
            src: "2.mp3",
            albumArt: "1.jpg" // Using 1.jpg for all for now, replace with unique images
        },
        {
            title: "Starlight Serenade",
            artist: "Cosmic Flow",
            src: "3.mp3",
            albumArt: "1.jpg"
        },
        {
            title: "Digital Horizon",
            artist: "ElectroPulse",
            src: "4.mp3",
            albumArt: "1.jpg"
        },
        {
            title: "Vaporwave Voyage",
            artist: "RetroGlide",
            src: "5.mp3",
            albumArt: "1.jpg"
        }
    ];

    let currentSongIndex = 0;
    const audio = new Audio(); // HTML5 Audio element

    // --- Splash Screen Logic ---
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            mainApp.classList.remove('hidden');
            // Initial load of the first song
            loadSong(currentSongIndex);
        }, { once: true });
    }, 3000); // Splash screen visible for 3 seconds

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = item.dataset.section;

            // Remove active class from all nav items and hide all sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));


            // Add active class to clicked nav item and show target section
            item.classList.add('active');
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }
        });
    });

    // --- Audio Player Logic ---

    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        currentAlbumArt.src = song.albumArt;
        currentSongTitle.textContent = song.title;
        currentArtistName.textContent = song.artist;
        miniAlbumArt.src = song.albumArt;
        miniSongTitle.textContent = song.title;
        miniArtistName.textContent = song.artist;

        // Reset seekbar and time display
        seekbar.value = 0;
        currentTimeSpan.textContent = '0:00';
        totalTimeSpan.textContent = '0:00';
    }

    function playSong() {
        audio.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
        miniPlayPauseBtn.querySelector('.material-icons').textContent = 'pause';
    }

    function pauseSong() {
        audio.pause();
        playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
        miniPlayPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    }

    // Event Listeners for Controls
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    miniPlayPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextBtn.addEventListener('click', nextSong);
    miniNextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    // Seekbar functionality
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekbar.value = progress || 0; // Handle NaN if duration is not available yet

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        };

        currentTimeSpan.textContent = formatTime(audio.currentTime);
        if (audio.duration) {
            totalTimeSpan.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audio.duration);
    });

    seekbar.addEventListener('input', () => {
        const seekTime = (seekbar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Volume control
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });

    // Autoplay next song when current one ends
    audio.addEventListener('ended', nextSong);

    // Initial volume setting
    audio.volume = volumeSlider.value / 100;
});

// Helper function for time formatting (can be moved inside DOMContentLoaded if preferred)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
