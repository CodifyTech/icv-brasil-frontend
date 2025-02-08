<script setup lang="ts">
import * as cdfRules from '@/validators/cdf-rules'
import CDFManager from '@/components/CDF/CDFManager.vue'
import { useRubricaStore } from '@/pages/rubricas/store/useRubricaStore'
import type { IRubrica } from '@/pages/rubricas/types'
import { TipoRubricaEnum } from '@/pages/rubricas/enums/TipoRubrica'

const store = useRubricaStore()

const {
  adicionarRubrica,
  listarRubricas,
  atualizarRubrica,
  deletarRubrica,
} = store

const {
  items,
} = storeToRefs(store)

const managers = computed(() => {
  return [
    {
      title: 'Tributos',
      items: items.value.tributos,
      template: {
        id: '',
        nome: '',
        tipo: TipoRubricaEnum.TRIBUTOS,
        tipo_valor: 'PORCENTAGEM',
        valor: 0,
      },
      messageAdd: 'Adicionar Tributo',
    },
    {
      title: 'Custos',
      items: items.value.custos,
      template: {
        id: '',
        nome: '',
        tipo: TipoRubricaEnum.CUSTOS,
        tipo_valor: 'VALOR',
        valor: 0,
      },
      messageAdd: 'Adicionar Custo',
    },
    {
      title: 'Despesas',
      items: items.value.despesas,
      template: {
        id: '',
        nome: '',
        tipo: TipoRubricaEnum.DESPESAS,
        tipo_valor: 'VALOR',
        valor: 0,
      },
      messageAdd: 'Adicionar Despesa',
    },
    {
      title: 'Despesas Diretas',
      items: items.value.despesas,
      template: {
        id: '',
        nome: '',
        tipo: TipoRubricaEnum.DESPESAS_DIRETAS,
        tipo_valor: 'VALOR',
        valor: 0,
      },
      messageAdd: 'Adicionar Despesa',
    },
    {
      title: 'Despesas Indiretas',
      items: items.value.despesas,
      template: {
        id: '',
        nome: '',
        tipo: TipoRubricaEnum.DESPESAS_INDIRETAS,
        tipo_valor: 'VALOR',
        valor: 0,
      },
      messageAdd: 'Adicionar Despesa',
    },
  ]
})

onMounted(async () => {
  await listarRubricas()
})
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          v-for="(manager, index) in managers"
          :key="index"
          cols="12"
        >
          <CDFManager
            v-model:items="manager.items"
            :title="manager.title"
            item-title="nome"
            :message-add="manager.messageAdd"
            :template="manager.template"
            is-add-icon-button
            @update:item-add="async item => await adicionarRubrica(item, index)"
            @update:item-update="async (item) => await atualizarRubrica(item, index)"
            @update:item-destroy="async (item) => await deletarRubrica(item.id)"
          >
            <template #header="{ item }: { item: IRubrica }">
              <div class="d-flex flex-column gap-2 pa-4">
                <VLabel v-if="item.nome">
                  {{ item.nome }}
                </VLabel>
              </div>
            </template>
            <template #content="{ item }: {item: IRubrica}">
              <VRow>
                <VCol cols="12">
                  <CDFTextField
                    v-model="item.nome"
                    label="Nome da Rúbrica"
                    placeholder="Digite o nome da rúbrica"
                    :rules="[cdfRules.requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="item.tipo_valor"
                    label="Tipo"
                    placeholder="Selecione um tipo"
                    :items="[
                      { title: 'Valor', value: 'VALOR' },
                      { title: 'Porcentagem', value: 'PORCENTAGEM' },
                    ]"
                    :rules="[cdfRules.requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <CDFTextField
                    v-model="item.valor"
                    label="Valor"
                    placeholder="Digite o valor"
                    :rules="[cdfRules.requiredValidator]"
                  />
                </VCol>
              </VRow>
            </template>
          </CDFManager>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
