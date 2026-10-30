# Site Daniely Akemi Arquitetura & Interiores

Site estático (HTML + CSS + JS puro, sem build). Implementa o handoff em `../README.md`.

```
index.html        Home (one-page)
projetos.html     Listas Residencial/Comercial + página de projeto + lightbox (#residencial, #comercial, #p=<id>)
css/style.css     Tokens, componentes e estilos das duas páginas
js/yk.js          Cortina de transição e navegação entre páginas
js/home.js        Preloader, reveals, parallax, cursor, sliders, lightbox da Home
js/projetos.js    Roteamento por hash, animações e lightbox dos projetos
img/              Assets (com1–4.png foram renomeados para cm1–4.png: COM1–COM4 são nomes reservados no Windows)
```

## Rodar localmente

Abrir via servidor HTTP (não por `file://`):

```bash
npx serve .
```

ou qualquer servidor estático (`python -m http.server`, extensão Live Server etc.).

## Dados editáveis

- Projetos: array `PROJECTS` em `js/projetos.js` (fotos em `img/p/<id>/01.jpg …`; `01` é a capa). Pendentes: IN, AJ, AK.
- Conteúdo da Home (ambientes, comerciais, etapas, depoimentos): arrays no topo de `js/home.js`.

## Pendências

- Links de Instagram, Pinterest, Facebook e "Leo Designs" estão como `#`.
- O formulário de contato não tem back-end: ao enviar, abre o WhatsApp do escritório com a mensagem preenchida.
- O toggle EN aponta para `/en` do site original.
