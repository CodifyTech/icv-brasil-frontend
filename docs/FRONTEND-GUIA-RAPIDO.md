# Guia Rápido - Alterações Frontend

## 📦 Arquivos Criados

### 1. `src/enums/RoleEnum.ts` ✅ NOVO

Enum com todos os cargos e funções utilitárias.

### 2. `src/composables/useDepartmentFilter.ts` ✅ NOVO

Composable para gerenciar filtros de departamento.

### 3. `docs/FRONTEND-ALTERACOES-PERMISSOES.md` ✅ NOVO

Documentação completa das alterações.

## 📝 Arquivos Modificados

### 1. `src/composables/useAuth.ts` ✅ ATUALIZADO

- Adicionado `getUserRoleSlug()`
- Adicionado `hasAnyRole()`
- Adicionado `hasFullAccessRole()`
- Adicionado `needsDepartmentFilterRole()`
- Adicionado `getCurrentRoleName()`
- Adicionado `isNewRole()`

### 2. `src/pages/users/types.ts` ✅ ATUALIZADO

- Adicionado campo `departamento_id` em `IUser`
- Adicionado campo `funcionario` em `IUser`
- Criada interface `IFuncionario`

## 🚀 Como Usar

### Verificar Cargo

```typescript
import { useAuth } from '@/composables/useAuth'

const { hasRole, RoleEnum } = useAuth()

if (hasRole(RoleEnum.RH)) {
  // Código para RH
}
```

### Aplicar Filtro de Departamento

```typescript
import { useDepartmentFilter } from '@/composables/useDepartmentFilter'

const { addDepartmentFilter } = useDepartmentFilter()

const params = addDepartmentFilter({ page: 1 })
// Automaticamente adiciona departamento_id se necessário
```

### Verificar Acesso Total

```typescript
import { useAuth } from '@/composables/useAuth'

const { hasFullAccessRole } = useAuth()

if (hasFullAccessRole()) {
  // Usuário é SENIOR ou Admin - vê tudo
}
```

## ✅ Compatibilidade

O sistema mantém compatibilidade com cargos antigos:

- `diretor` → `senior`
- `gerente` → `pleno`
- `coordenador` → `pleno`
- `analista` → `comercial`
- `auditor` → `junior`
- `inmetro` → `inmetro-qualidade`

## 📚 Documentação Completa

Consulte `docs/FRONTEND-ALTERACOES-PERMISSOES.md` para:

- Exemplos detalhados de uso
- Boas práticas
- Casos de teste
- Referência completa da API

---

**Status:** ✅ Pronto para uso  
**Data:** 06/10/2025
