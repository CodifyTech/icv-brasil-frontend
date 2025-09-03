# ICV Brasil - Frontend

Interface moderna desenvolvida com Vue 3, TypeScript e Vuetify seguindo as melhores práticas de desenvolvimento frontend.

## 🚀 Tecnologias

- **Vue 3** 3.5.13 (Composition API)
- **TypeScript** 5.7.2
- **Vuetify** 3.7.5 (Material Design)
- **Vite** 5.4.11
- **Pinia** 2.3.0 (State Management)
- **Vue Router** 4.5.0

## 📋 Pré-requisitos

- **Node.js** 18+ ou 20+
- **pnpm** 10.15.0 (recomendado)
- **Git**

## ⚙️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd icv-brasil-frontend
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o ambiente**
```bash
cp .env.example .env
```

4. **Configure as variáveis de ambiente**
```env
# API Backend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=ICV Brasil
VITE_APP_VERSION=1.0.0
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── @core/           # Utilitários core do sistema
├── @layouts/        # Layouts da aplicação
├── components/      # Componentes reutilizáveis
├── composables/     # Composables Vue 3
├── pages/           # Páginas (file-based routing)
├── services/        # Serviços de API
├── stores/          # Stores Pinia
├── types/           # Tipos TypeScript
├── utils/           # Utilitários gerais
└── validators/      # Validações de formulários
```

### Padrões Utilizados
- **Composition API**: API moderna do Vue 3
- **Auto-imports**: Importação automática de APIs e componentes
- **File-based Routing**: Roteamento baseado em arquivos
- **TypeScript Strict**: Tipagem rigorosa

## 🎨 UI/UX

### Framework UI
- **Vuetify 3.7.5**: Material Design completo
- **Componentes responsivos**: Adaptação mobile/desktop
- **Temas customizáveis**: Dark/Light mode
- **Ícones**: Material Design Icons + FontAwesome

### Funcionalidades Visuais
- **Gráficos**: ApexCharts + Chart.js
- **Editor de texto**: TipTap WYSIWYG
- **Carrossel**: Swiper.js
- **Tour guiado**: Shepherd.js

## 🌍 Internacionalização

Sistema completo de i18n com **vue-i18n**:

```typescript
// Uso em componentes
const { t } = useI18n()
const title = t('common.welcome')

// Uso em templates
<h1>{{ $t('common.welcome') }}</h1>
```

Idiomas suportados:
- Português (BR) - padrão
- Inglês (EN)

## 🔐 Autenticação

### Login
```typescript
// stores/auth.ts
const authStore = useAuthStore()
await authStore.login(email, password)
```

### Proteção de Rotas
```typescript
// Middleware automático baseado em meta
{
  path: '/admin',
  meta: { requiresAuth: true, roles: ['admin'] }
}
```

### Controle de Acesso (CASL)
```typescript
// Verificação de permissões
const { can } = useAbility()
if (can('read', 'User')) {
  // Usuário pode visualizar usuários
}
```

## 📊 Gerenciamento de Estado

### Pinia Stores
```typescript
// stores/users.ts
export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      users.value = await usersService.getUsers()
    } finally {
      loading.value = false
    }
  }

  return { users, loading, fetchUsers }
})
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build

# Qualidade de Código
pnpm lint             # ESLint + correção automática
pnpm format           # Prettier formatting
pnpm typecheck        # Verificação TypeScript

# Utilitários
pnpm build:icons      # Build de ícones customizados
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📦 Build e Deploy

### Build de Produção
```bash
pnpm build
```

### Variáveis de Ambiente
```env
# Produção
VITE_API_BASE_URL=https://api.icvbrasil.com/api/v1
VITE_APP_NAME=ICV Brasil
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

### Deploy Estático
O build gera arquivos estáticos na pasta `dist/` que podem ser servidos por qualquer servidor web:

- **Nginx**
- **Apache**
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**

## 🔧 Configurações Avançadas

### Vite Config
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia']
    }),
    Components({
      resolvers: [VuetifyResolver()]
    })
  ]
})
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 📱 Responsividade

### Breakpoints Vuetify
- **xs**: < 600px (mobile)
- **sm**: 600px - 960px (tablet)
- **md**: 960px - 1264px (laptop)
- **lg**: 1264px - 1904px (desktop)
- **xl**: > 1904px (large desktop)

### Uso
```vue
<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="6" lg="4">
        <!-- Responsivo: 12 cols mobile, 6 tablet, 4 desktop -->
      </VCol>
    </VRow>
  </VContainer>
</template>
```

## 🎯 Funcionalidades Principais

### Dashboard
- Gráficos interativos
- Métricas em tempo real
- Filtros avançados

### Gestão de Usuários
- CRUD completo
- Controle de permissões
- Upload de avatar

### Formulários
- Validação em tempo real
- Máscaras automáticas
- Auto-save

### Relatórios
- Exportação PDF/Excel
- Gráficos customizáveis
- Filtros dinâmicos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- **ESLint**: Configuração rigorosa
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **TypeScript**: Tipagem obrigatória

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: suporte@icvbrasil.com
- Documentação: [docs.icvbrasil.com](https://docs.icvbrasil.com)