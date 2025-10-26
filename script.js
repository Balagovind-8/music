// Initialize Lucide Icons
lucide.createIcons();

// --- Playlist Data ---
const playlist = [
    { name: "Galactic Groove", artist: "Astro Beats", path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Synth Wave Drive", artist: "Retro Future", path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Deep Space Chill", artist: "Nebula Flow", path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

// --- DOM Elements ---
const trackNameEl = document.getElementById('track-name');
const trackArtistEl = document.getElementById('track-artist');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');

// --- State Variables ---
let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// --- Utility ---
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec.toString().padStart(2,'0')}`;
}

// --- Core Functions ---
function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    trackNameEl.textContent = track.name;
    trackArtistEl.textContent = track.artist;
    audio.src = track.path;
    progressBar.value = 0;
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    progressBar.disabled = true;
    if(isPlaying) audio.play().catch(e => console.error(e));
}

function togglePlayPause() {
    if(isPlaying) audio.pause();
    else audio.play().catch(e => console.error(e));
    isPlaying = !isPlaying;
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}

function nextTrack() {
    loadTrack((currentTrackIndex+1)%playlist.length);
    if(isPlaying) audio.play().catch(e => console.error(e));
}

function prevTrack() {
    loadTrack((currentTrackIndex-1+playlist.length)%playlist.length);
    if(isPlaying) audio.play().catch(e => console.error(e));
}

// --- Event Listeners ---
audio.addEventListener('loadedmetadata', ()=>{
    durationEl.textContent = formatTime(audio.duration);
    progressBar.max = audio.duration;
    progressBar.disabled = false;
});
audio.addEventListener('timeupdate', ()=>{
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('ended', ()=>{
    nextTrack();
});

progressBar.addEventListener('input', ()=>audio.currentTime = progressBar.value);
volumeSlider.addEventListener('input', (e)=>audio.volume = e.target.value);
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// --- Initialization ---
audio.volume = volumeSlider.value;
window.onload = ()=> loadTrack(currentTrackIndex);
