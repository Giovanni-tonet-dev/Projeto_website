# TechCell — Documentação do Projeto

E-commerce de smartphones e acessórios.

## Estrutura de Pastas

```
TechCell/
├── index.html          # Página principal (home)
├── css/
│   ├── base.css        # Variáveis CSS globais e reset (importar primeiro)
│   ├── navbar.css      # Cabeçalho compartilhado entre todas as páginas
│   ├── home.css        # Estilos exclusivos da home
│   ├── auth.css        # Login e registro (compartilhado)
│   ├── produto.css     # Páginas de detalhe de produto (compartilhado)
│   ├── carrinho.css    # Página do carrinho
│   └── favoritos.css   # Página de favoritos
├── js/
│   ├── login.js        # Autenticação via localStorage
│   └── registro.js     # Cadastro de contas via localStorage
├── pages/
│   ├── login.html      # Tela de login
│   ├── registro.html   # Tela de criar conta
│   ├── carrinho.html   # Carrinho de compras
│   ├── favoritos.html  # Lista de favoritos
│   ├── produto1.html   # Detalhe: iPhone 17 Pro Max
│   ├── produto2.html   # Detalhe: Samsung Galaxy S23 Ultra
│   └── termos.html     # Termos de uso e política de privacidade
└── img/
    ├── galaxy_S25.png
    ├── tela_iphone17.png
    ├── xiomi.png
    ├── s23-img.png
    ├── produto1.png
    └── img_user.png
```

## Padrão de CSS

Todas as páginas seguem a mesma ordem de importação:

```html
<link rel="stylesheet" href="../css/base.css">    <!-- 1. Sempre primeiro -->
<link rel="stylesheet" href="../css/navbar.css">  <!-- 2. Se tiver navbar -->
<link rel="stylesheet" href="../css/[pagina].css"> <!-- 3. CSS específico -->
```

As variáveis CSS globais estão em `base.css` e devem ser usadas em vez de valores fixos:

| Variável                | Valor padrão     |
|-------------------------|------------------|
| `--color-primary`       | `#3b82f6`        |
| `--color-primary-dark`  | `#2563eb`        |
| `--color-bg`            | `#f1f5f9`        |
| `--color-text`          | `#1e293b`        |
| `--color-text-muted`    | `#64748b`        |
| `--color-error`         | `#ef4444`        |
| `--color-success`       | `#22c55e`        |
| `--header-height`       | `70px`           |
| `--radius`              | `8px`            |
| `--transition`          | `0.3s ease`      |

## Autenticação

O fluxo de autenticação usa `localStorage` para persistir contas e `sessionStorage` para a sessão ativa:

- **Registro** (`registro.html` + `js/registro.js`): salva em `localStorage.accounts[]`
- **Login** (`login.html` + `js/login.js`): valida e salva sessão em `sessionStorage.loggedUser`

>  **Nota:** Para produção, substitua por uma API real com autenticação segura (JWT, OAuth, etc.). Nunca armazene senhas em texto puro no `localStorage`.

## Melhorias Futuras

- [ ] Componentizar a navbar com JavaScript (evitar repetição em cada HTML)
- [ ] Implementar backend real com autenticação segura
- [ ] Adicionar funcionalidade real ao carrinho e favoritos
- [ ] Criar página de busca funcional
- [ ] Adicionar mais produtos dinamicamente via API
