# Portifólio

Portfólio pessoal de Kawê Keven, construído com HTML, CSS e JavaScript puros.

## Organização MVVM

```text
.
├── index.html             # View: estrutura semântica da página
├── css/
│   └── styles.css         # View: apresentação e responsividade
├── js/
│   ├── model.js           # Model: dados da interface
│   └── view-model.js      # ViewModel: eventos e estado visual
└── assets/
	└── images/            # Certificados e imagens locais
```

Abra o `index.html` no navegador para visualizar o projeto. O módulo JavaScript usa apenas APIs nativas do navegador, então não há dependências para instalar.

## Deploy no Cloudflare

O arquivo `wrangler.jsonc` configura a raiz do projeto como diretório de assets estáticos. No Cloudflare, use o comando:

```bash
npx wrangler versions upload
```

Também é possível publicar diretamente com:

```bash
npx wrangler deploy
```