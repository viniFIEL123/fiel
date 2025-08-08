# Beyby - Site Gamer de Drops

---

## Sobre

Projeto de site estático moderno para drops/venda de Skins, Armas e Veículos com tema gamer escuro e neon roxo. Suporta cadastro e login local, permissões para owner, criação e exclusão de posts com imagens e download.

---

## Arquivos

- `index.html` — Página inicial.
- `skins.html` — Página da categoria Skins.
- `armas.html` — Página da categoria Armas.
- `veiculos.html` — Página da categoria Veículos.
- `styles.css` — Estilos CSS.
- `app.js` — Script JS com toda lógica.
- `assets/logo.png` — Logo placeholder.
- `README.md` — Este arquivo.

---

## Como usar

1. Baixe todos os arquivos e pastas.
2. Abra `index.html` no seu navegador (Chrome, Firefox, Edge...).
3. Navegue pelo menu para acessar as páginas de Skins, Armas e Veículos.
4. Para usar login/registro:
   - Clique em **Entrar**.
   - Para registrar, preencha usuário, email e senha e clique em Registrar.
   - Para logar, preencha usuário e senha e clique em Entrar.
   - **Usuário OWNER fixo:** `beyby` / senha: `123` (apenas para demonstração).
5. O OWNER pode postar novos drops nas páginas de categoria clicando no botão **Postar**.
6. Novos drops aparecem para todos e são salvos no `localStorage` do navegador.
7. Logout está disponível no cabeçalho quando logado.

---

## Segurança

⚠️ **IMPORTANTE:**

- As credenciais do OWNER estão **hard-coded no front-end**, apenas para demonstração.  
- Em produção, **não use** essa abordagem! Use backend com autenticação segura, hashing (bcrypt) e HTTPS.  
- Senhas são salvas em **texto puro no `localStorage`**, o que é inseguro.  
- Este projeto é para **fins educacionais e demonstração local** apenas.

---

## Observações Técnicas

- Projeto 100% estático, sem backend.
- Persistência e sessão via `localStorage`.
- Imagens postadas são convertidas em DataURL e salvas localmente.
- Responsivo para desktop e mobile.
- Usado apenas HTML, CSS e JS vanilla moderno.

---

## Contato

Desenvolvido para demonstração pelo ChatGPT.

---

Abraços e bons drops! 🎮✨
