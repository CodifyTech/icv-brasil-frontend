# Alterações no Frontend - Nova Estrutura de Permissões

**Data:** 06 de Outubro de 2025  
**Projeto:** ICV Brasil Frontend  
**Versão:** 2.0 - Nova Estrutura de Cargos e Permissões

---

## 📋 Sumário

Este documento detalha as alterações implementadas no frontend para suportar a nova estrutura de cargos e permissões do sistema ICV Brasil.

---

## 🎯 Arquivos Criados/Modificados

### 1. Enum de Roles

**Arquivo:** `src/enums/RoleEnum.ts` ✅ **NOVO**

Define todos os cargos do sistema e utilitários relacionados.

**Conteúdo:**

- `RoleEnum`: Enum com todos os cargos (novos e antigos)
- `RoleNames`: Mapeamento de slugs para nomes descritivos
- `rolesWithFullAccess`: Array de cargos com acesso total
- `rolesWithDepartmentFilter`: Array de cargos com filtro de departamento
- `hasFullAccess()`: Função para verificar acesso total
- `needsDepartmentFilter()`: Função para verificar necessidade de filtro
- `getRoleName()`: Função para obter nome descritivo

**Uso:**

```typescript
import { RoleEnum, hasFullAccess } from '@/enums/RoleEnum'

// Verificar se usuário tem acesso total
if (hasFullAccess(userRole)) {
  // Mostrar todos os dados
}
```

### 2. Composable useAuth

**Arquivo:** `src/composables/useAuth.ts` ✅ **ATUALIZADO**

Adicionadas novas funções para trabalhar com os cargos.

**Novas funcionalidades:**

- `getUserRoleSlug()`: Obtém o slug do role do usuário (compatível com string ou objeto)
- `hasAnyRole(roles: string[])`: Verifica se usuário tem um dos cargos especificados
- `hasFullAccessRole()`: Verifica se usuário tem acesso total
- `needsDepartmentFilterRole()`: Verifica se usuário precisa de filtro de departamento
- `getCurrentRoleName()`: Obtém nome descritivo do cargo atual
- `isNewRole()`: Verifica se é um dos novos cargos

**Uso:**

```typescript
import { useAuth } from '@/composables/useAuth'

const { hasFullAccessRole, RoleEnum } = useAuth()

// Verificar se pode editar usuários
if (hasRole(RoleEnum.RH)) {
  // Mostrar botão de editar usuários
}
```

### 3. Composable useDepartmentFilter

**Arquivo:** `src/composables/useDepartmentFilter.ts` ✅ **NOVO**

Gerencia filtros de departamento automaticamente.

**Funcionalidades:**

- `shouldApplyFilter()`: Verifica se filtro deve ser aplicado
- `getUserDepartmentId()`: Obtém ID do departamento do usuário
- `addDepartmentFilter<T>(params)`: Adiciona filtro de departamento aos parâmetros
- `canViewItem(itemDepartmentId)`: Verifica se usuário pode ver um item

**Uso:**

```typescript
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'

const { addDepartmentFilter, canViewItem } = useDepartmentFilter()

// Adicionar filtro em requisições
const params = addDepartmentFilter({ page: 1, perPage: 10 })
// Se usuário não for SENIOR, params terá: { page: 1, perPage: 10, departamento_id: X }

// Verificar se pode ver item
if (canViewItem(proposta.departamento_id)) {
  // Exibir proposta
}
```

### 4. Tipos de Usuário

**Arquivo:** `src/pages/users/types.ts` ✅ **ATUALIZADO**

Adicionados novos campos ao tipo `IUser`.

**Novos campos:**

```typescript
export interface IUser {
  // ... campos existentes
  departamento_id?: string | number  // ID do departamento do usuário
  funcionario?: IFuncionario         // Dados do funcionário vinculado
}

interface IFuncionario {
  id?: string
  nome?: string
  departamento_id?: string | number  // Departamento do funcionário
}
```

---

## 🔧 Como Usar nos Componentes

### Exemplo 1: Verificar Cargo Específico

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { hasRole, RoleEnum } = useAuth()

// Verificar se é RH
const isRH = computed(() => hasRole(RoleEnum.RH))
</script>

<template>
  <VBtn v-if="isRH" @click="createUser">
    Criar Usuário
  </VBtn>
</template>
```

### Exemplo 2: Exibir Baseado em Acesso Total

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { hasFullAccessRole } = useAuth()

const canViewAllData = hasFullAccessRole()
</script>

<template>
  <VAlert v-if="canViewAllData" color="info">
    Você tem acesso a todos os departamentos
  </VAlert>
  <VAlert v-else color="warning">
    Você visualiza apenas dados do seu departamento
  </VAlert>
</template>
```

### Exemplo 3: Filtrar Requisições por Departamento

```vue
<script setup lang="ts">
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'
import { onMounted } from 'vue'

const { addDepartmentFilter } = useDepartmentFilter()

const fetchPropostas = async () => {
  const params = addDepartmentFilter({
    page: 1,
    perPage: 10,
  })
  
  // params automaticamente incluirá departamento_id se necessário
  const response = await api.get('/propostas', { params })
}

onMounted(() => {
  fetchPropostas()
})
</script>
```

### Exemplo 4: Verificar se Pode Visualizar Item

```vue
<script setup lang="ts">
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'

const { canViewItem } = useDepartmentFilter()

const propostas = ref([
  { id: 1, titulo: 'Proposta A', departamento_id: 1 },
  { id: 2, titulo: 'Proposta B', departamento_id: 2 },
])

const visiblePropostas = computed(() => 
  propostas.value.filter(p => canViewItem(p.departamento_id))
)
</script>

<template>
  <VCard v-for="proposta in visiblePropostas" :key="proposta.id">
    {{ proposta.titulo }}
  </VCard>
</template>
```

### Exemplo 5: Mostrar Nome do Cargo

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { getCurrentRoleName } = useAuth()

const roleName = getCurrentRoleName()
</script>

<template>
  <VChip color="primary">
    {{ roleName }}
  </VChip>
</template>
```

---

## 🎨 Navegação e Menus

Os menus já estão configurados para usar o sistema de permissões via `action` e `subject`. Não são necessárias alterações adicionais, pois o backend já retorna as permissões corretas para cada cargo.

**Como funciona:**

```typescript
// src/navigation/vertical/index.ts
{
  title: 'Usuários',
  icon: { icon: 'fa-light fa-user-tie' },
  to: 'funcionario',
  action: 'list',           // Ação necessária
  subject: 'funcionario',   // Recurso
}
```

O sistema verifica automaticamente se o usuário tem a permissão `funcionario list`. Apenas RH e SENIOR terão todas as permissões de usuários.

---

## 📊 Mapeamento de Permissões por Cargo

### SENIOR

- **Acesso Total:** ✅ Sem restrições
- **Filtro Departamento:** ❌ Não
- **Pode ver:** Tudo

### PLENO

- **Acesso:** Amplo (sem usuários)
- **Filtro Departamento:** ✅ Sim
- **Pode ver:** Propostas e OS do seu departamento

### COMERCIAL

- **Acesso:** Clientes e Propostas
- **Filtro Departamento:** ✅ Sim
- **Pode ver:** Apenas propostas do seu departamento
- **Bloqueios:** Não vê OS (parte operacional)

### RH

- **Acesso:** Usuários e Funcionários
- **Filtro Departamento:** ❌ Não
- **Exclusivo:** Único cargo que pode gerenciar usuários

### FINANCEIRO

- **Acesso:** Dados INMETRO (leitura)
- **Filtro Departamento:** ❌ Não
- **Restrição:** Apenas leitura

### JUNIOR

- **Acesso:** Ordens de Serviço
- **Filtro Departamento:** ✅ Sim
- **Pode ver:** Apenas OS do seu departamento

### INMETRO/QUALIDADE

- **Acesso:** Dados INMETRO (leitura)
- **Filtro Departamento:** ❌ Não
- **Restrição:** Apenas leitura

---

## 🔐 Boas Práticas

### 1. Sempre Usar Composables

```typescript
// ✅ BOM
import { useAuth } from '@/composables/useAuth'
const { hasRole } = useAuth()

// ❌ RUIM - Não acessar cookie diretamente
const userData = useCookie('userData')
```

### 2. Usar Enum ao Invés de Strings

```typescript
// ✅ BOM
import { RoleEnum } from '@/enums/RoleEnum'
if (hasRole(RoleEnum.RH)) { }

// ❌ RUIM - String hardcoded
if (hasRole('rh')) { }
```

### 3. Aplicar Filtro de Departamento em Listas

```typescript
// ✅ BOM
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'
const { addDepartmentFilter } = useDepartmentFilter()
const params = addDepartmentFilter({ page: 1 })

// ⚠️ ATENÇÃO - Sem filtro, pode expor dados indevidos
const params = { page: 1 }
```

### 4. Verificar Permissões no Template

```vue
<!-- ✅ BOM - Usa permissões do backend -->
<VBtn v-if="$can('create', 'users')">
  Criar Usuário
</VBtn>

<!-- ✅ TAMBÉM BOM - Usa role check -->
<VBtn v-if="hasRole(RoleEnum.RH)">
  Criar Usuário
</VBtn>
```

---

## ⚠️ Migrações e Compatibilidade

### Cargos Antigos vs Novos

O sistema mantém compatibilidade com cargos antigos durante a transição:

```typescript
// Estes cargos ainda funcionam:
RoleEnum.Diretor      // Será migrado para RoleEnum.Senior
RoleEnum.Gerente      // Será migrado para RoleEnum.Pleno
RoleEnum.Coordenador  // Será migrado para RoleEnum.Pleno
RoleEnum.Analista     // Será migrado para RoleEnum.Comercial
RoleEnum.Auditor      // Será migrado para RoleEnum.Junior
RoleEnum.Inmetro      // Será migrado para RoleEnum.InmetroQualidade
```

### Verificações Múltiplas Durante Transição

```typescript
// Durante a transição, verificar ambos os cargos
const hasFullAccess = hasAnyRole([
  RoleEnum.Senior,
  RoleEnum.Diretor,  // Compatibilidade
])
```

---

## 🧪 Testes

### Teste 1: Verificar Filtro de Departamento

1. Login com usuário PLENO
2. Acessar lista de propostas
3. Verificar que apenas propostas do departamento aparecem
4. Verificar parâmetro `departamento_id` na requisição

### Teste 2: Acesso Total SENIOR

1. Login com usuário SENIOR
2. Acessar lista de propostas
3. Verificar que todas as propostas aparecem
4. Verificar que **não** há parâmetro `departamento_id` na requisição

### Teste 3: RH Gerenciando Usuários

1. Login com usuário RH
2. Verificar botão "Criar Usuário" visível
3. Login com COMERCIAL
4. Verificar botão "Criar Usuário" **não** visível

### Teste 4: COMERCIAL sem OS

1. Login com usuário COMERCIAL
2. Verificar que menu "OS" **não** aparece
3. Tentar acessar `/os` diretamente
4. Deve ser bloqueado por falta de permissão

---

## 📦 Arquivos Modificados - Resumo

```
src/
├── enums/
│   └── RoleEnum.ts                        ✅ NOVO
├── composables/
│   ├── useAuth.ts                         ✅ ATUALIZADO
│   └── useDepartmentFilter.ts             ✅ NOVO
└── pages/
    └── users/
        └── types.ts                       ✅ ATUALIZADO
```

---

## 🚀 Próximos Passos

1. **Testar em desenvolvimento:**

   ```bash
   npm run dev
   ```

2. **Testar com diferentes cargos:**
   - Criar usuários de teste para cada cargo
   - Verificar permissões e filtros

3. **Verificar integração com backend:**
   - Confirmar que permissões são retornadas corretamente
   - Validar filtros de departamento

4. **Documentar casos específicos:**
   - Adicionar exemplos específicos da aplicação
   - Documentar componentes personalizados

---

## 📞 Suporte

Em caso de dúvidas sobre as alterações do frontend:

1. Consultar este documento
2. Verificar exemplos de uso acima
3. Consultar código dos composables criados
4. Contatar equipe de desenvolvimento

---

**Status:** ✅ Implementação Frontend concluída  
**Última atualização:** 06 de Outubro de 2025  
**Versão do documento:** 1.0
