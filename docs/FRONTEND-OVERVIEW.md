# 📘 Visão Geral do Frontend - ICV Brasil

## 🏗️ Arquitetura do Frontend

### Stack Tecnológica

- **Framework**: Vue 3.5.13 (Composition API)
- **Build Tool**: Vite 5.4.11
- **Linguagem**: TypeScript 5.7.2
- **UI Framework**: Vuetify 3.7.5 (Material Design)
- **Package Manager**: pnpm 10.15.0

### Padrões Arquiteturais

- **Composition API**: Uso moderno do Vue 3
- **Auto-imports**: Configurado com unplugin-auto-import
- **Componentes Automáticos**: unplugin-vue-components
- **Roteamento Modular**: unplugin-vue-router
- **TypeScript Strict**: Configuração rigorosa de tipos

## 📂 Estrutura de Pastas

```
src/
├── @core/           # Utilitários core do sistema
├── @layouts/        # Layouts da aplicação
├── assets/          # Recursos estáticos (imagens, fontes)
├── components/      # Componentes reutilizáveis
├── composables/     # Composables Vue 3
├── configs/         # Configurações da aplicação
├── enums/           # Enumerações TypeScript
├── extensions/      # Extensões e plugins customizados
├── helpers/         # Funções auxiliares
├── layouts/         # Layouts alternativos
├── navigation/      # Configuração de navegação
├── pages/           # Páginas da aplicação (file-based routing)
├── plugins/         # Plugins Vue customizados
├── services/        # Serviços de API e lógica de negócio
├── stores/          # Stores Pinia (gerenciamento de estado)
├── types/           # Definições de tipos TypeScript
├── utils/           # Utilitários gerais
├── validators/      # Validações de formulários
├── views/           # Componentes de visualização
├── App.vue          # Componente raiz
└── main.ts          # Ponto de entrada da aplicação
```

## 📦 Principais Dependências

### 🎯 **Core Vue Ecosystem**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `vue` | 3.5.13 | Framework principal Vue 3 |
| `vue-router` | 4.5.0 | Roteamento SPA |
| `pinia` | 2.3.0 | Gerenciamento de estado |
| `vuetify` | 3.7.5 | Framework UI Material Design |

### 🛠️ **Build & Development**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `vite` | 5.4.11 | Build tool ultra-rápido |
| `typescript` | 5.7.2 | Superset JavaScript com tipagem |
| `unplugin-auto-import` | 0.18.6 | Auto-importação de APIs |
| `unplugin-vue-components` | 0.27.5 | Auto-importação de componentes |
| `unplugin-vue-router` | 0.8.8 | Roteamento baseado em arquivos |

### 🎨 **UI/UX & Componentes**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `@tiptap/*` | 2.10.3 | Editor de texto rico WYSIWYG |
| `apexcharts` | 3.54.1 | Gráficos interativos avançados |
| `chart.js` | 4.4.7 | Biblioteca de gráficos flexível |
| `swiper` | 11.1.15 | Carrossel e touch slider |
| `shepherd.js` | 13.0.3 | Sistema de tour guiado |
| `vue3-perfect-scrollbar` | 2.0.0 | Scrollbar customizada |

### 📝 **Formulários & Validação**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `maska` | 2.1.11 | Máscaras de input avançadas |
| `vue-the-mask` | 0.11.1 | Máscaras específicas para Vue |
| `vue-currency-input` | 3.0.5 | Input especializado para moedas |
| `vue-debounce` | 4.0.1 | Debounce em inputs e eventos |
| `v3-infinite-loading` | 1.3.1 | Carregamento infinito |

### 🌍 **Internacionalização & Utils**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `vue-i18n` | 10.0.4 | Sistema de internacionalização |
| `moment` | 2.30.1 | Manipulação e formatação de datas |
| `axios` | 1.7.6 | Cliente HTTP para APIs |
| `jwt-decode` | 4.0.0 | Decodificação de tokens JWT |
| `cookie-es` | 1.2.2 | Manipulação de cookies |

### 🔐 **Autenticação e Segurança**

| Dependência | Versão | Propósito |
|-------------|---------|-----------|
| `@casl/ability` | 6.7.2 | Controle de acesso baseado em roles |
| `@casl/vue` | 2.2.2 | Integração CASL com Vue |
| `jwt-decode` | 4.0.0 | Decodificação de JWT |
| `cookie-es` | 1.2.2 | Gerenciamento seguro de cookies |

## 🎨 UI/UX & Estilização

### **Framework Principal**

- **Vuetify 3.7.5**: Framework Material Design completo
  - Componentes pré-construídos
  - Sistema de grid responsivo
  - Temas customizáveis
  - Ícones integrados

### **Sistema de Estilos**

- **SCSS/Sass**: Pré-processador CSS
- **PostCSS**: Processamento pós-CSS
- **Stylelint**: Linting de estilos
- **FontAwesome**: Ícones vetoriais

### **Componentes Customizados**

- **Vue 3 Composition API**: Componentes modernos e reutilizáveis
- **TypeScript**: Tipagem forte para props e eventos
- **Auto-imports**: Componentes disponíveis globalmente

## 🌍 Internacionalização (vue-i18n)

### **Configuração**

- **vue-i18n@10.0.4**: Sistema completo de i18n
- **Suporte a múltiplos idiomas**: Português (BR) + outros
- **Lazy loading**: Carregamento sob demanda de traduções
- **Formatação**: Datas, números e moedas localizadas

### **Estrutura de Traduções**

```
locales/
├── pt-BR/
│   ├── common.json
│   ├── forms.json
│   └── validation.json
├── en/
│   ├── common.json
│   ├── forms.json
│   └── validation.json
└── index.ts
```

## 📊 Gráficos e Visualizações

### **Bibliotecas Principais**

- **ApexCharts 3.54.1**: Gráficos interativos avançados
- **Chart.js 4.4.7**: Biblioteca de gráficos flexível
- **vue-chartjs 5.3.2**: Wrapper Vue para Chart.js
- **vue3-apexcharts 1.8.0**: Wrapper Vue para ApexCharts

### **Tipos de Visualizações**

- Gráficos de linha, área e barras
- Gráficos de pizza e rosca
- Dashboards interativos
- Gráficos responsivos
- Exportação de dados

### **Editor de Texto Rico**

- **Tiptap 2.10.3**: Editor WYSIWYG moderno
- **Extensões**: Highlight, imagem, link, alinhamento
- **Markdown**: Suporte a markdown-it
- **Tarefas**: Listas de tarefas interativas

## 🧩 Formulários e Validações

### **Sistema de Máscaras**

- **Maska 2.1.11**: Máscaras avançadas e flexíveis
- **Vue The Mask 0.11.1**: Máscaras específicas para Vue
- **Suporte**: CPF, CNPJ, telefone, CEP, moeda

### **Validações**

- **Validators customizados**: Pasta `src/validators/`
- **Validação em tempo real**: Debounce integrado
- **Mensagens i18n**: Validações localizadas

### **Inputs Especializados**

- **Vue Currency Input**: Input para valores monetários
- **Infinite Loading**: Carregamento de dados paginados
- **Formulários responsivos**: Adaptação mobile/desktop

## 🔐 Autenticação e Segurança

### **Sistema de Autenticação**

- **JWT**: Tokens JSON Web Token
- **Cookies seguros**: Manipulação via cookie-es
- **Decodificação**: jwt-decode para validação

### **Controle de Acesso**

- **CASL**: Sistema de permissões baseado em roles
- **Abilities**: Definição de capacidades do usuário
- **Guards de rota**: Proteção baseada em permissões

### **Segurança**

- **HTTPS**: Comunicação criptografada
- **XSS Protection**: Prevenção de ataques XSS
- **CSRF Protection**: Proteção contra CSRF

## 🚀 Boas Práticas de Desenvolvimento

### **Padrões de Código**

- **ESLint**: Linting rigoroso com regras customizadas
- **Prettier**: Formatação automática de código
- **TypeScript Strict**: Configuração rigorosa de tipos
- **Vue Style Guide**: Seguindo padrões oficiais Vue

### **Performance**

- **Lazy Loading**: Carregamento sob demanda
- **Code Splitting**: Divisão automática de bundles
- **Tree Shaking**: Eliminação de código não utilizado
- **HMR**: Hot Module Replacement para desenvolvimento

### **Testes**

- **Vitest**: Framework de testes moderno
- **MSW**: Mock Service Worker para APIs
- **Coverage**: Relatórios de cobertura de código

## 📌 Exemplo de Fluxo Completo

### **1. Usuário acessa rota**

```typescript
// pages/users/index.vue
<template>
  <UsersList />
</template>

<script setup lang="ts">
// Auto-importado via unplugin-auto-import
import { useUsersStore } from '@/stores/users'
import { onMounted } from 'vue'

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchUsers()
})
</script>
```

### **2. Store Pinia gerencia estado**

```typescript
// stores/users.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersService } from '@/services/users'

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

### **3. Service faz chamada API**

```typescript
// services/users.ts
import { api } from '@/configs/api'

export const usersService = {
  async getUsers() {
    const response = await api.get('/users')
    return response.data
  }
}
```

### **4. Componente renderiza dados**

```typescript
// components/UsersList.vue
<template>
  <VCard>
    <VCardTitle>{{ $t('users.title') }}</VCardTitle>
    <VCardText>
      <VDataTable
        :items="usersStore.users"
        :loading="usersStore.loading"
        :headers="headers"
      />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const usersStore = useUsersStore()

const headers = computed(() => [
  { title: t('users.name'), key: 'name' },
  { title: t('users.email'), key: 'email' }
])
</script>
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build
pnpm typecheck        # Verificação de tipos TypeScript

# Qualidade de Código
pnpm lint             # Linting e correção automática
pnpm format           # Formatação de código
pnpm build:icons      # Build de ícones customizados
```

## 📊 Métricas de Qualidade

- **TypeScript**: 100% de cobertura de tipos
- **ESLint**: Configuração rigorosa com regras customizadas
- **Stylelint**: Padrões de CSS/SCSS consistentes
- **Vue DevTools**: Integração completa para debugging
- **Hot Reload**: Desenvolvimento ultra-rápido com Vite

---

*Documento gerado automaticamente - Última atualização: Janeiro 2025*
