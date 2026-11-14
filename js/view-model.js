import { fallbackCertificate, terminalCommands, terminalSequence } from './model.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderTerminalStatic(termBody) {
  termBody.innerHTML = terminalSequence.map((item) =>
    `<p class="ln"><span class="prompt">${item.prompt}$</span> ${item.command}</p><p class="ln out">${item.output}</p>`
  ).join('');
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
  termBody.querySelectorAll('.ln, .out').forEach((line) => line.remove());
  const inputForm = termBody.querySelector('.terminal-form');
  const appendLine = (line) => {
    if (inputForm) termBody.insertBefore(line, inputForm);
    else termBody.appendChild(line);
  };
  for (const item of terminalSequence) {
    const commandLine = document.createElement('p');
    commandLine.className = 'ln';
    commandLine.innerHTML = `<span class="prompt">${item.prompt}$ </span>`;
    const command = document.createElement('span');
    commandLine.appendChild(command);
    appendLine(commandLine);
    await typeLine(command, item.command, 28);
    await new Promise((resolve) => setTimeout(resolve, 180));
    const output = document.createElement('p');
    output.className = 'ln out';
    output.textContent = item.output;
    appendLine(output);
    await new Promise((resolve) => setTimeout(resolve, 260));
  }
}

function appendTerminalInput(termBody) {
  const form = document.createElement('form');
  form.className = 'terminal-form';
  form.innerHTML = '<span class="prompt">visitor@site$</span><input class="terminal-input" type="text" name="command" autocomplete="off" spellcheck="false" aria-label="Digite um comando" placeholder="digite ajuda">';
  termBody.appendChild(form);

  const input = form.elements.command;
  const appendLine = (command, output) => {
    const line = document.createElement('p');
    line.className = 'ln';
    line.innerHTML = `<span class="prompt">visitor@site$</span> ${command}`;
    termBody.insertBefore(line, form);
    if (output) {
      const response = document.createElement('p');
      response.className = 'ln out';
      response.textContent = output;
      termBody.insertBefore(response, form);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!command) return;
    const action = terminalCommands[command];

    if (!action) {
      appendLine(command, `comando não encontrado: ${command}. Digite ajuda.`);
    } else if (action.clear) {
      termBody.querySelectorAll('.ln, .out').forEach((line) => line.remove());
    } else {
      appendLine(command, action.output);
      if (action.target) document.querySelector(action.target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      if (action.url) window.open(action.url, '_blank', 'noopener');
    }
    input.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  });

  termBody.addEventListener('click', () => input.focus());
  input.focus();
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
  let previewHovered = false;
  let hideTimer;
  let activeCard = null;
  let imageWasHovered = false;

  const show = (card) => {
    if (activeCard && activeCard !== card && preview.classList.contains('visible')) return;
    clearTimeout(hideTimer);
    activeCard = card;
    imageWasHovered = false;
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
    if (previewHovered) return;
    preview.classList.remove('visible');
    preview.setAttribute('aria-hidden', 'true');
    activeCard = null;
    imageWasHovered = false;
  };
  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 120);
  };

  const enterImage = () => {
    previewHovered = true;
    imageWasHovered = true;
    clearTimeout(hideTimer);
  };
  const leaveImage = () => {
    previewHovered = false;
    hide();
  };
  image.addEventListener('mouseenter', enterImage);
  image.addEventListener('mouseleave', leaveImage);
  image.addEventListener('pointerenter', enterImage);
  image.addEventListener('pointerleave', leaveImage);
  document.addEventListener('mousemove', (event) => {
    if (preview.classList.contains('visible') && imageWasHovered) {
      const bounds = image.getBoundingClientRect();
      const insideImage = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!insideImage) {
        previewHovered = false;
        hide();
      }
    } else if (event.target !== image && !imageWasHovered) {
      previewHovered = false;
    }
  });
  preview.addEventListener('mouseleave', hide);

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('[data-cert-title]').forEach((card) => {
    if (supportsHover) {
      card.addEventListener('mouseenter', () => show(card));
      card.addEventListener('mouseleave', scheduleHide);
    }
    card.addEventListener('focus', () => show(card));
    card.addEventListener('blur', scheduleHide);
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
  if (reduceMotion) {
    renderTerminalStatic(terminal);
    appendTerminalInput(terminal);
  } else {
    appendTerminalInput(terminal);
    playTerminal(terminal);
  }
});