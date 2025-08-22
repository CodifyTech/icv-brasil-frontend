# 📊 Exportação CSV - Frontend

## 📋 Visão Geral

Sistema completo de exportação de CSV no frontend do ICV Brasil, incluindo utilitários reutilizáveis, composable e integração com o backend.

## 🏗️ Arquitetura Implementada

### **Estrutura dos Arquivos**
```
src/
├── utils/
│   └── csvUtils.ts              # Utilitários para manipulação CSV
├── composables/
│   └── useCSVExport.ts          # Composable para facilitar uso
├── pages/inmetro/
│   ├── index.vue                # Interface principal
│   └── services/
│       └── InmetroService.ts    # Serviço com método específico
└── pages/os/store/
    └── useOrdemServicoStore.ts  # Store com lógica de exportação
```

## 🔧 Componentes Principais

### **1. CSVUtils (src/utils/csvUtils.ts)**
Utilitário com métodos estáticos para manipulação CSV:

```typescript
import { CSVUtils } from '@/utils/csvUtils'

// Download de blob como CSV
CSVUtils.downloadCSVFromBlob(blob, { filename: 'relatorios.csv' })

// Conversão de array para CSV
const csvContent = CSVUtils.arrayToCSV(data, headers, { separator: ';' })

// Download direto de array
CSVUtils.downloadCSVFromArray(data, headers, { 
  filename: 'dados.csv',
  separator: ';',
  addBOM: true 
})

// Formatação de dados
CSVUtils.formatDateForCSV(date)           // Data em formato PT-BR
CSVUtils.formatCurrencyForCSV(value)      // Moeda em formato PT-BR
CSVUtils.formatStringForCSV(text)         // Limpa strings
```

### **2. useCSVExport (src/composables/useCSVExport.ts)**
Composable que facilita o uso em componentes Vue:

```typescript
import { useCSVExport } from '@/composables/useCSVExport'

const { exportToCSV, exportBlobToCSV, formatOSDataForCSV } = useCSVExport()

// Exportar array de dados
await exportToCSV(data, headers, { filename: 'relatorio.csv' })

// Exportar blob
await exportBlobToCSV(blob, { filename: 'dados.csv' })

// Formatar dados de OS específicos
const formattedData = formatOSDataForCSV(ordensServico)
```

### **3. InmetroService.exportarCSV()**
Método específico no serviço para requisições ao backend:

```typescript
// No serviço
async exportarCSV(filtros?: any): Promise<Blob> {
  // Configura responseType: 'blob' automaticamente
  // Aplica filtros na URL
  // Retorna Blob pronto para download
}

// Uso no store
const blob = await InmetroService.exportarCSV(this.filtros)
```

## 📊 Funcionalidades Implementadas

### **Backend Integration**
- ✅ Requisição HTTP com `responseType: 'blob'`
- ✅ Aplicação automática de filtros via query string
- ✅ Headers corretos (`Accept: text/csv`)
- ✅ Tratamento de erros específico

### **Frontend Processing**
- ✅ Download automático de arquivos
- ✅ Geração de nomes de arquivo com timestamp
- ✅ Suporte a BOM para caracteres especiais
- ✅ Escape de caracteres especiais CSV
- ✅ Formatação de dados brasileira (datas, moedas)

### **User Experience**
- ✅ Loading state no botão de exportação
- ✅ Feedback visual (snackbar) para sucesso/erro
- ✅ Aplicação automática de filtros ativos
- ✅ Validação de dados antes da exportação

## 🎯 Exemplo de Uso Completo

### **No Componente Vue:**
```vue
<template>
  <VBtn
    color="secondary"
    variant="outlined"
    prepend-icon="tabler-download"
    :loading="loading.relatorios"
    :disabled="loading.relatorios"
    @click="exportarRelatorios"
  >
    {{ loading.relatorios ? 'Exportando...' : 'Exportar CSV' }}
  </VBtn>
</template>

<script setup lang="ts">
const exportarRelatorios = async () => {
  try {
    // Aplicar filtros atuais
    const filtrosLimpos = {
      cliente_id: filtroForm.value.cliente_id || undefined,
      data_inicio: filtroForm.value.data_inspecao_inicio || undefined,
      // ... outros filtros
    }
    
    filtros.value = filtrosLimpos
    loading.value.relatorios = true
    
    await store.exportarCSV()
  }
  catch (error) {
    // Tratamento de erro já feito no store
  }
  finally {
    loading.value.relatorios = false
  }
}
</script>
```

### **No Store:**
```typescript
async exportarCSV() {
  try {
    this.loading.relatorios = true
    
    // Requisição ao backend
    const blob = await InmetroService.exportarCSV(this.filtros)

    // Download do arquivo
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    const filename = `relatorios_inmetro_${new Date().toISOString().split('T')[0]}.csv`

    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    // Feedback de sucesso
    this.snackbarStore.showSnackbar({
      text: 'CSV exportado com sucesso!',
      color: 'success',
      timeout: 3000,
    })
  }
  catch (error) {
    // Tratamento de erro e feedback
  }
  finally {
    this.loading.relatorios = false
  }
}
```

## 🔄 Fluxo Completo de Exportação

1. **User Action**: Usuário clica no botão "Exportar CSV"
2. **Filtros**: Aplicação automática dos filtros ativos do formulário
3. **Loading**: Ativação do estado de loading no botão
4. **Request**: Requisição HTTP ao backend com filtros
5. **Backend**: Processamento e geração do CSV no servidor
6. **Response**: Retorno do arquivo como Blob
7. **Download**: Criação automática do link de download
8. **Feedback**: Exibição de mensagem de sucesso/erro
9. **Cleanup**: Limpeza de recursos e reset do loading

## 📈 Configurações Suportadas

### **Opções do CSV:**
```typescript
interface CSVExportOptions {
  filename?: string      // Nome do arquivo (padrão: export_YYYY-MM-DD.csv)
  separator?: string     // Separador (padrão: ';')
  addBOM?: boolean      // BOM para UTF-8 (padrão: true)
}
```

### **Filtros de Exportação:**
- Cliente
- Responsável (Inspetor)
- Escopo de Acreditação
- Tipo de Serviço
- Período (Data de Inspeção)
- Fornecedor
- Número do Pedido
- Certificado Associado
- Número da OS

## 🎨 Benefícios da Implementação

### **Reutilização**
- `CSVUtils` pode ser usado em qualquer parte do sistema
- `useCSVExport` facilita implementação em novos componentes
- Padrão consistente para futuras exportações

### **Performance**
- Download direto via blob (sem carregamento em memória)
- Processamento no backend (otimizado)
- Filtros aplicados no banco de dados

### **UX**
- Feedback visual imediato
- Estados de loading claros
- Tratamento de erros amigável
- Download automático

### **Manutenibilidade**
- Código modular e bem estruturado
- Tipagem TypeScript completa
- Documentação inline
- Testes unitários suportados

## 🚀 Próximas Melhorias (Opcional)

- [ ] **Cache de exportações** para filtros frequentes
- [ ] **Exportação assíncrona** para grandes volumes
- [ ] **Compressão** de arquivos grandes
- [ ] **Múltiplos formatos** (XLSX, PDF)
- [ ] **Templates customizáveis** de exportação
- [ ] **Histórico** de exportações

---

*Documentação gerada em: {{ date('d/m/Y H:i:s') }}*
*Versão: 1.0*
*Implementação Frontend Vue 3 + TypeScript*
