<script lang="ts" setup>
import { usePropostaStore } from '@/pages/proposta/store/usePropostaStore'
import CDFManager from '@/components/CDF/CDFManager.vue'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, ITributo } from '@/pages/proposta/types'

const store = usePropostaStore()

const {

} = store

const {
  data,
  modal,
} = storeToRefs(store)
</script>

<template>
  <VDialog
    v-model="modal.isDialogVisible"
    max-width="800"
    fullscreen
  >
    <VToolbar>
      <VBtn
        icon="tabler-x"
        @click="modal.isDialogVisible = false"
      />

      <VToolbarTitle>Serviço</VToolbarTitle>

      <VSpacer />

      <VToolbarItems>
        <VBtn
          @click="() => {
            modal.isDialogVisible = false
            data.servicos.push(modal.servico)
            modal.servico = {
              custos: [],
              despesas: [],
              tributos: [],
              despesas_indiretas: [],
              despesas_diretas: [],
            }
          }"
        >
          Inserir Serviço
        </VBtn>
      </VToolbarItems>
    </VToolbar>

    <VCard flat>
      <VCardText class="d-flex flex-column gap-2">
        <CDFTextField
          v-model="modal.servico.nome"
          label="Serviço Solicitado"
          placeholder="Digite o serviço solicitado"
          :rules="[]"
        />

        <VCard flat>
          <VCardText class="pa-0">
            <VRow>
              <VCol cols="4">
                <CDFManager
                  v-model:items="modal.servico.custos"
                  title="Custos"
                  item-title="nome"
                  item-label="Custo"
                  message-add="Adicionar"
                  :template="{
                    nome: '',
                    valor: 0,
                  }"
                >
                  <template #content="{ item }: { item: ICusto }">
                    <AppTextField
                      v-model="item.nome"
                      label="Mão de Obra"
                      placeholder="Digite o nome mão da obra"
                    />
                    <InputDinheiro
                      v-model="item.valor"
                      label="Valor"
                      placeholder="Digite o valor"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </template>
                </CDFManager>
              </VCol>
              <VCol cols="4">
                <CDFManager
                  v-model:items="modal.servico.despesas"
                  title="Despesas"
                  item-title="nome"
                  item-label="Despesa"
                  message-add="Adicionar"
                  :template="{
                    nome: '',
                    valor: 0,
                  }"
                >
                  <template #content="{ item }: { item: IDespesa }">
                    <AppTextField
                      v-model="item.nome"
                      label="Despesa"
                      placeholder="Digite o nome da despesa"
                    />
                    <InputDinheiro
                      v-model="item.valor"
                      label="Valor"
                      placeholder="Digite o valor"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </template>
                </CDFManager>
              </VCol>
              <VCol cols="4">
                <CDFManager
                  v-model:items="modal.servico.tributos"
                  title="Tributos"
                  item-title="nome"
                  item-label="Tributo"
                  message-add="Adicionar"
                  :template="{
                    nome: '',
                    aliquota: 0,
                  }"
                >
                  <template #content="{ item }: { item: ITributo }">
                    <AppTextField
                      v-model="item.nome"
                      label="Tributo"
                      placeholder="Digite o nome do tributo"
                    />
                    <InputDinheiro
                      v-model="item.aliquota"
                      label="Alíquota"
                      placeholder="Digite a alíquota"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </template>
                </CDFManager>
              </VCol>

              <VCol cols="4">
                <CDFManager
                  v-model:items="modal.servico.despesas_diretas"
                  title="Despesas Diretas"
                  item-title="nome"
                  item-label="Despesa Direta"
                  message-add="Adicionar"
                  :template="{
                    nome: '',
                    valor: 0,
                  }"
                >
                  <template #content="{ item }: { item: IDespesaDireta }">
                    <AppTextField
                      v-model="item.nome"
                      label="Despesa"
                      placeholder="Digite o nome da despesa"
                    />
                    <InputDinheiro
                      v-model="item.valor"
                      label="Valor"
                      placeholder="Digite o valor"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </template>
                </CDFManager>
              </VCol>
              <VCol cols="4">
                <CDFManager
                  v-model:items="modal.servico.despesas_indiretas"
                  title="Despesas Indiretas"
                  item-title="nome"
                  item-label="Despesa Indireta"
                  message-add="Adicionar"
                  :template="{
                    nome: '',
                    valor: 0,
                  }"
                >
                  <template #content="{ item }: { item: IDespesaIndireta }">
                    <AppTextField
                      v-model="item.nome"
                      label="Despesa"
                      placeholder="Digite o nome da despesa"
                    />
                    <InputDinheiro
                      v-model="item.valor"
                      label="Valor"
                      placeholder="Digite o valor"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </template>
                </CDFManager>
              </VCol>
              <VCol cols="4">
                <VCard variant="outlined">
                  <template #title>
                    Resultado Mínimo Aprovado
                  </template>
                  <VDivider />
                  <VCardText>
                    <InputDinheiro
                      v-model="modal.servico.valor_total_hd"
                      label="Valor total hd"
                      placeholder="Digite o Valor total hd"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_total_despesas"
                      label="Valor total despesas"
                      placeholder="Digite o Valor total despesas"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_total_tributos"
                      label="Valor total tributos"
                      placeholder="Digite o Valor total tributos"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_total_despesas_indiretas"
                      label="Valor total despesas indiretas"
                      placeholder="Digite o Valor total despesas indiretas"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_total"
                      label="Valor total"
                      placeholder="Digite o Valor total"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_k_minimo"
                      label="Valor k minimo"
                      placeholder="Digite o Valor k minimo"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                    <InputDinheiro
                      v-model="modal.servico.valor_diaria_minimo"
                      label="Valor diaria minimo"
                      placeholder="Digite o Valor diaria minimo"
                      prepend-inner-icon="tabler-currency-real"
                      :rules="[]"
                    />
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCardText>
    </VCard>
  </VDialog>
</template>
