# 📸 Componente PhotoUpload

## Descrição

O componente `PhotoUpload` é um componente avançado para upload de fotos com funcionalidades de drag & drop, preview de imagens, upload múltiplo e validações.

## 🚀 Funcionalidades

- **Drag & Drop**: Arraste fotos diretamente para o componente
- **Upload Múltiplo**: Suporte a múltiplos arquivos simultâneos
- **Preview de Imagens**: Visualização em tempo real das fotos
- **Validações**: Tipo de arquivo, tamanho e quantidade máxima

- **Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Estados de Loading**: Indicadores visuais durante operações
- **Tratamento de Erros**: Mensagens de erro claras e informativas

## 📋 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `modelValue` | `PhotoItem[]` | `[]` | Array de fotos (v-model) |
| `label` | `string` | `'Fotos'` | Label do componente |
| `placeholder` | `string` | `'Arraste fotos aqui...'` | Texto de placeholder |
| `multiple` | `boolean` | `true` | Permite múltiplos arquivos |
| `accept` | `string` | `'image/*'` | Tipos de arquivo aceitos |
| `maxFiles` | `number` | `10` | Número máximo de arquivos |
| `maxFileSize` | `number` | `5` | Tamanho máximo em MB |

| `disabled` | `boolean` | `false` | Desabilita o componente |
| `loading` | `boolean` | `false` | Estado de loading |

## 🎯 Events

| Event | Payload | Descrição |
|-------|---------|-----------|
| `update:modelValue` | `PhotoItem[]` | Emitido quando as fotos mudam |
| `upload` | `File[]` | Emitido quando arquivos são adicionados |
| `remove` | `(item, index)` | Emitido quando uma foto é removida |
| `error` | `string` | Emitido quando ocorre um erro |

## 📱 Interface PhotoItem

```typescript
interface PhotoItem {
  id?: string | null
  file?: File
  url: string
  nome?: string
}
```

## 💻 Exemplo de Uso

### Uso Básico

```vue
<script setup>
import { ref } from 'vue'

const fotos = ref([])
</script>

<template>
  <PhotoUpload
    v-model="fotos"
    label="Minhas Fotos"
    placeholder="Arraste fotos aqui"
  />
</template>
```

### Uso Avançado

```vue
<script setup>
import { ref } from 'vue'

const fotos = ref([])
const loading = ref(false)

const handleUpload = files => {
  console.log('Fotos enviadas:', files)

  // Implementar upload para servidor
}

const handleRemove = (item, index) => {
  console.log('Foto removida:', item, 'índice:', index)

  // Implementar remoção do servidor
}

const handleError = error => {
  console.error('Erro:', error)

  // Mostrar notificação de erro
}
</script>

<template>
  <PhotoUpload
    v-model="fotos"
    label="Fotos da OS"
    placeholder="Arraste fotos da ordem de serviço"
    :max-files="20"
    :max-file-size="10"
    :show-description="true"
    :disabled="loading"
    @upload="handleUpload"
    @remove="handleRemove"
    @error="handleError"
  />
</template>
```

## 🎨 Estilos

O componente usa as variáveis CSS do tema Vuetify para cores e espaçamentos:

- **Cores**: `--v-theme-primary`, `--v-theme-error`, `--v-theme-surface-variant`
- **Espaçamentos**: `--v-theme-border-color`, `--v-theme-on-surface`, `--v-theme-on-surface-variant`
- **Transições**: Animações suaves para hover e drag & drop

## 🔧 Personalização

### CSS Customizado

```scss
.photo-upload {
  .dropzone {
    border-color: #your-color;
    background-color: #your-bg;
  }
  
  .photo-card {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
```

### Props de Configuração

```vue
<PhotoUpload
  :max-files="50"
  :max-file-size="25"
  accept="image/jpeg,image/png"
/>
```

## 📱 Responsividade

O componente é totalmente responsivo:

- **Mobile**: 1 coluna por linha
- **Tablet**: 2 colunas por linha
- **Desktop**: 3-4 colunas por linha
- **Large**: 4+ colunas por linha

## 🚨 Validações

### Validações Automáticas

- **Tipo de arquivo**: Apenas imagens (configurável)
- **Tamanho**: Máximo configurável em MB
- **Quantidade**: Máximo de arquivos configurável

### Tratamento de Erros

- Mensagens claras e específicas
- Feedback visual imediato
- Prevenção de uploads inválidos

## 🔄 Estados

### Estados Visuais

- **Vazio**: Dropzone com instruções
- **Com fotos**: Grid de previews
- **Loading**: Indicadores de progresso
- **Erro**: Mensagens de erro
- **Disabled**: Estado desabilitado

### Transições

- Hover effects
- Drag & drop feedback
- Animações de entrada/saída
- Loading states

## 📚 Dependências

- **Vue 3**: Composition API
- **Vuetify 3**: Componentes de UI
- **TypeScript**: Tipagem forte
- **SCSS**: Estilos avançados

## 🧪 Testes

Para testar o componente:

1. Acesse `/test-photo-upload` no projeto
2. Teste drag & drop de imagens
3. Verifique validações de tipo e tamanho
4. Teste remoção de fotos
5. Verifique responsividade

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Fotos não aparecem**: Verifique se o `v-model` está configurado
2. **Erro de validação**: Verifique tipo e tamanho dos arquivos
3. **Layout quebrado**: Verifique se o container tem largura adequada

### Debug

Use o console do navegador para ver logs detalhados:

- Upload de arquivos
- Remoção de fotos
- Erros de validação
- Estado das fotos

## 📈 Roadmap

### Próximas Funcionalidades

- [ ] Upload progressivo para servidor
- [ ] Compressão de imagens
- [ ] Crop e redimensionamento
- [ ] Galeria em modal
- [ ] Zoom em imagens
- [ ] Filtros e busca
- [ ] Organização por pastas

---

*Componente desenvolvido para o projeto ICV Brasil Frontend*
*Versão: 1.0.0*
*Data: Janeiro 2025*
