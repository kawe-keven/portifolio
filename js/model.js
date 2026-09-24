// Model: dados que alimentam os componentes interativos da pagina.
export const terminalSequence = [
  { prompt: 'visitor@site', command: 'whoami', output: 'Kawe Keven Dos Santos Figueredo' },
  { prompt: 'visitor@site', command: 'cat role.txt', output: 'Estudante de ADS - Dev Front-end - Cyberseguranca' },
  { prompt: 'visitor@site', command: 'ls skills/', output: 'html css js python csharp aws cloud' },
  { prompt: 'visitor@site', command: 'cat status.txt', output: 'aberto a oportunidades - vamos conversar? ↓' }
];

export const terminalCommands = {
  ajuda: { output: 'comandos: sobre, skills, projetos, certificados, contato, github, linkedin, instagram, limpar' },
  sobre: { target: '#sobre', output: 'abrindo sobre...' },
  skills: { target: '#skills', output: 'abrindo skills...' },
  projetos: { target: '#projetos', output: 'abrindo projetos...' },
  certificados: { target: '#certificados', output: 'abrindo certificados...' },
  contato: { target: '#contato', output: 'abrindo contato...' },
  github: { url: 'https://github.com/kawe-keven', output: 'abrindo GitHub...' },
  linkedin: { url: 'https://www.linkedin.com/in/kawê-keven', output: 'abrindo LinkedIn...' },
  instagram: { url: 'https://www.instagram.com/dev.kevx_v', output: 'abrindo Instagram...' },
  limpar: { clear: true }
};

export const fallbackCertificate = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"%3E%3Crect width="1200" height="800" fill="%230d1219"/%3E%3Crect x="38" y="38" width="1124" height="724" rx="8" fill="none" stroke="%23ffb454" stroke-width="5"/%3E%3Ccircle cx="600" cy="250" r="92" fill="%23ffb454" opacity=".16" stroke="%23ffb454" stroke-width="5"/%3E%3Cpath d="m565 250 25 25 50-60" fill="none" stroke="%23ffb454" stroke-width="12"/%3E%3Cpath d="M230 410h740M330 475h540M430 540h340" stroke="%23e7edf4" stroke-width="12" opacity=".75"/%3E%3C/svg%3E';