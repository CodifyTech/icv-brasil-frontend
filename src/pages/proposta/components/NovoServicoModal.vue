<script lang="ts" setup>
import { usePropostaStore } from '@/pages/proposta/store/usePropostaStore'
import CDFManager from '@/components/CDF/CDFManager.vue'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, ITributo } from '@/pages/proposta/types'
import { formatCurrency } from '@/utils/generals'

const store = usePropostaStore()

const {
  obterRubricasFixas,
} = store

const {
  data,
  modal,
} = storeToRefs(store)

watch(() => modal.value.servico, value => {
  console.log(value)

  // Calcula os totais de custos e despesas
  const totalCustos = value.custos.reduce((sum, custo) => sum + (custo.valor || 0), 0) ?? 0
  const totalDespesas = value.despesas.reduce((sum, despesa) => sum + (despesa.valor || 0), 0) ?? 0
  const totalDespesasDiretas = value.despesas_diretas?.reduce((sum, despesa) => sum + (despesa.valor || 0), 0) ?? 0
  const totalDespesasIndiretas = value.despesas_indiretas?.reduce((sum, despesa) => sum + (despesa.valor || 0), 0) ?? 0

  // Base de cálculo total para os tributos
  const totalBaseCalculo = totalCustos + totalDespesas + totalDespesasDiretas + totalDespesasIndiretas

  // Atualiza os valores totais
  value.valor_total_custos = totalCustos
  value.valor_total_despesas = totalDespesas + totalDespesasDiretas + totalDespesasIndiretas

  // Função Auxiliar: Busca alíquota na tabela pela `nome`
  const getAliquotaByNome = (nome: string) => {
    const tributo = value.tributos.find(t => t.nome === nome)

    return tributo ? tributo.aliquota : 0 // Retorna o valor (alíquota) ou 0 se não encontrado
  }

  // Cálculo dos tributos conforme regras fornecidas
  const issAliquota = getAliquotaByNome('ISS')
  const irpjAliquota = getAliquotaByNome('IRPJ')
  const csslAliquota = getAliquotaByNome('CSLL')
  const pisAliquota = getAliquotaByNome('PIS')
  const cofinsAliquota = getAliquotaByNome('COFINS')

  const iss = (totalBaseCalculo * issAliquota) / 100
  const irpj = ((((totalBaseCalculo * irpjAliquota) / 100) * 15) / 100)
  const cssl = ((((totalBaseCalculo * csslAliquota) / 100) * 9) / 100)
  const pis = (totalBaseCalculo * pisAliquota) / 100
  const cofins = (totalBaseCalculo * cofinsAliquota) / 100

  // Soma total dos tributos
  value.valor_total_tributos = iss + irpj + cssl + pis + cofins
  value.valor_total = ((totalBaseCalculo + value.valor_total_tributos) * (1 + ((value.valor_k_minimo ?? 0) / 100)))
}, { deep: true })

onMounted(async () => {
  await obterRubricasFixas()
})
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
          color="primary"
          @click="() => {
            modal.isDialogVisible = false

            if (modal.servico.id) {
              // Serviço já existe, então atualiza o existente
              const index = data.servicos.findIndex(s => s.id === modal.servico.id)
              if (index !== -1) {
                data.servicos[index] = { ...modal.servico }
              }
            }
            else {
              // Serviço novo, adiciona à lista
              data.servicos.push(modal.servico)
            }

            // Reseta o modal
            modal.servico = {
              custos: [],
              despesas: [],
              tributos: [],
              despesas_indiretas: [],
              despesas_diretas: [],
            }
          }"
        >
          Salvar
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
          <VCol cols="6">
            <InputDinheiro
              v-model="modal.servico.valor_diaria_minimo"
              label="Valor Diária Mínima"
              placeholder="Digite o valor da diária mínima"
              prepend-inner-icon="tabler-currency-real"
              :rules="[]"
            />
          </VCol>
          <VCol cols="6">
            <InputDinheiro
              v-model="modal.servico.valor_k_minimo"
              label="Valor do K Mímino"
              placeholder="Digite o valor do k mínimo"
              prepend-inner-icon="tabler-currency-real"
              :rules="[]"
            />
          </VCol>
          <VRow class="mx-0">
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
                    is-read-only
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
                        readonly
                      />
                      <InputDinheiro
                        v-model="item.aliquota"
                        label="Alíquota"
                        placeholder="Digite a alíquota"
                        prepend-inner-icon="tabler-currency-real"
                        :rules="[]"
                        readonly
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
                    is-read-only
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
                        readonly
                      />
                      <InputDinheiro
                        v-model="item.valor"
                        label="Valor"
                        placeholder="Digite o valor"
                        prepend-inner-icon="tabler-currency-real"
                        readonly
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
                    is-read-only
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
                        readonly
                      />
                      <InputDinheiro
                        v-model="item.valor"
                        label="Valor"
                        placeholder="Digite o valor"
                        prepend-inner-icon="tabler-currency-real"
                        readonly
                        :rules="[]"
                      />
                    </template>
                  </CDFManager>
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="2"
              class="d-flex"
            >
              <VCard
                variant="outlined"
                class="flex-1"
              >
                <VCardTitle class="py-4">
                  Resultado Mínimo Aprovado
                </VCardTitle>
                <VDivider />
                <VCardText class="pl-4">
                  <span class="d-flex gap-2"><b>Custos:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_total_custos) }}</span>
                  <span class="d-flex gap-2"><b>Despesas:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_total_despesas) }}</span>
                  <span class="d-flex gap-2"><b>Tributos:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_total_tributos) }}</span>
                  <span class="d-flex gap-2"><b>Diária Mínimo:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_diaria_minimo) }}</span>
                  <span class="d-flex gap-2"><b>K Mínimo:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_k_minimo) }}</span>
                  <span class="d-flex gap-2"><b>Total:</b> <VSpacer /> {{ formatCurrency(modal.servico.valor_total) }}</span>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </vrow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
