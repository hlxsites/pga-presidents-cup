import { fetchPlaceholders } from '../../scripts/scripts.js';

function displayVideo(e) {
  const block = e.target.closest('.block');
  const video = block.querySelector('.video');
  video.classList.add('video-play-mode');
  const iFrame = video.querySelector('iframe');
  if (!iFrame.src && iFrame.dataset.src) {
    iFrame.src = iFrame.dataset.src;
  }
  iFrame.src += '&autoplay=1';
}

function closeVideo(e) {
  const video = e.target.closest('.video');
  video.classList.remove('video-play-mode');
  const iframe = video.querySelector('iframe');
  iframe.src = iframe.getAttribute('src').replace('&autoplay=1', '');
}

function buildDefaultVideo(id, inHero, title) {
  const videoUrl = 'https://players.brightcove.net/6082840763001/6QBtcb032_default/index.html?videoId=';
  return `<div class="video-iframe-wrapper">
    <iframe loading="lazy" ${inHero ? 'data-' : ''}src='${videoUrl}${id}' allow="encrypted-media" title="${title}" allowfullscreen></iframe>
  </div>`;
}

async function loadVideo(block) {
  const id = block.textContent.trim();
  if (id) {
    const placeholders = await fetchPlaceholders();
    const inHero = [...block.classList].includes('video-hero');
    const video = buildDefaultVideo(id, inHero, placeholders.videoPlayer);
    block.innerHTML = video;

    if (inHero) {
      block.parentNode.classList.add('video-wrapper-hero');
      // build play button
      const playButton = document.createElement('div');
      playButton.classList.add('video-hero-play');
      playButton.addEventListener('click', displayVideo);
      block.parentNode.append(playButton);
      // build close button
      const closeButton = document.createElement('div');
      closeButton.classList.add('video-hero-close');
      closeButton.addEventListener('click', closeVideo);
      block.prepend(closeButton);
    }
  }
}

export default function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      loadVideo(block);
    }
  }, { threshold: 0 });

  observer.observe(block);
}
