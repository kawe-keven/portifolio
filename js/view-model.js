import { fallbackCertificate, terminalSequence } from './model.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderTerminalStatic(termBody) {
  termBody.innerHTML = terminalSequence.map((item) =>
    `<p class="ln"><span class="prompt">${item.prompt}$</span> ${item.command}</p><p class="ln out">${item.output}</p>`
  ).join('') + '<p class="ln"><span class="prompt">visitor@site$</span> <span class="term-cursor"></span></p>';
}

function typeLine(element, text, speed) {
  return new Promise((resolve) => {
    let index = 0;
    const timer = setInterval(() => {
      element.textContent = text.slice(0, index++);
      if (index > text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function playTerminal(termBody) {
  termBody.innerHTML = '';
  for (const item of terminalSequence) {
    const commandLine = document.createElement('p');
    commandLine.className = 'ln';
    commandLine.innerHTML = `<span class="prompt">${item.prompt}$ </span>`;
    const command = document.createElement('span');
    commandLine.appendChild(command);
    termBody.appendChild(commandLine);
    await typeLine(command, item.command, 28);
    await new Promise((resolve) => setTimeout(resolve, 180));
    const output = document.createElement('p');
    output.className = 'ln out';
    output.textContent = item.output;
    termBody.appendChild(output);
    await new Promise((resolve) => setTimeout(resolve, 260));
  }
  termBody.insertAdjacentHTML('beforeend', '<p class="ln"><span class="prompt">visitor@site$</span> <span class="term-cursor"></span></p>');
}

function setupNavigation() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

function setupCertificates() {
  const preview = document.getElementById('certPreview');
  const image = document.getElementById('certPreviewImage');
  const caption = document.getElementById('certPreviewCaption');

  const show = (card) => {
    image.onerror = () => {
      image.onerror = null;
      image.src = fallbackCertificate;
    };
    image.src = card.dataset.certImage || fallbackCertificate;
    image.alt = card.dataset.certTitle || '';
    caption.textContent = `${card.dataset.certIssuer || 'DIO'} - ${card.dataset.certTitle || ''}`;
    preview.classList.add('visible');
    preview.setAttribute('aria-hidden', 'false');
  };
  const hide = () => {
    preview.classList.remove('visible');
    preview.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-cert-title]').forEach((card) => {
    card.addEventListener('mouseenter', () => show(card));
    card.addEventListener('mouseleave', hide);
    card.addEventListener('focus', () => show(card));
    card.addEventListener('blur', hide);
  });
}

function setupReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('in'));
  }
}

function setupTilt() {
  if (reduceMotion) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupCertificates();
  setupReveal();
  setupTilt();
  const terminal = document.getElementById('termBody');
  if (reduceMotion) renderTerminalStatic(terminal);
  else playTerminal(terminal);
});