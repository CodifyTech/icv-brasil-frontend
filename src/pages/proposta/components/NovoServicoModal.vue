<script lang="ts" setup>
import { usePropostaStore } from '@/pages/proposta/store/usePropostaStore'
import CDFManager from '@/components/CDF/CDFManager.vue'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, ITributo } from '@/pages/proposta/types'
import { formatCurrency } from '@/utils/generals'

const store = usePropostaStore()

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
    <VToolbar color="#FFFFFF">
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
      <VCardText>
        <VRow>
          <VCol cols="12">
            <CDFTextField
              v-model="modal.servico.nome"
              label="Serviço Solicitado"
              placeholder="Digite o serviço solicitado"
              :rules="[]"
            />
          </VCol>
          <VCol cols="10">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
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
              <VCol
                cols="12"
                md="6"
              >
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
              <VCol
                cols="12"
                md="4"
              >
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
              <VCol
                cols="12"
                md="4"
              >
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
              <VCol
                cols="12"
                md="4"
              >
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
            </VRow>
          </VCol>
          <VCol cols="2">
            <VCard variant="outlined">
              <VCardTitle class="py-4">
                Resultado Mínimo Aprovado
              </VCardTitle>
              <VDivider />
              <VCardText class="px-2">
                <span class="d-flex gap-2"><b>Valor HD:</b> {{ formatCurrency(modal.servico.valor_total_hd) }}</span>
                <span class="d-flex gap-2"><b>Valor Despesas:</b> {{ formatCurrency(modal.servico.valor_total_despesas) }}</span>
                <span class="d-flex gap-2"><b>Valor Tributos:</b> {{ formatCurrency(modal.servico.valor_total_tributos) }}</span>
                <span class="d-flex gap-2"><b>Valor Despesas Indiretas:</b> {{ formatCurrency(modal.servico.valor_total_despesas_indiretas) }}</span>
                <span class="d-flex gap-2"><b>Valor K Mínimo:</b> {{ formatCurrency(modal.servico.valor_k_minimo) }}</span>
                <span class="d-flex gap-2"><b>Valor Diária Mínimo:</b> {{ formatCurrency(modal.servico.valor_diaria_minimo) }}</span>
                <span class="d-flex gap-2"><b>Valor Total:</b> {{ formatCurrency(modal.servico.valor_total) }}</span>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
