<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'

definePage({
  meta: {
    action: 'read',
    subject: 'inmetro',
  },
})

const route = useRoute()
const store = useInmetroStore()
const printMode = ref(false)

const {
  ordemServicoAtual,
  loading,
} = storeToRefs(store)

onMounted(async () => {
  await store.fetchOrdemServico(route.params.id as string)
})

const formatDate = (date: string | undefined) => {
  if (!date)
    return '-'

  return new Date(date).toLocaleDateString('pt-BR')
}

const getResultadoColor = (resultado: string) => {
  const colors = {
    aprovado: 'success',
    reprovado: 'error',
    condicional: 'warning',
  }

  return colors[resultado as keyof typeof colors] || 'grey'
}

const handlePrint = () => {
  printMode.value = true
  nextTick(() => {
    window.print()
    printMode.value = false
  })
}

const handleDownloadPDF = async () => {
  try {
    await store.downloadRelatorioPDF(ordemServicoAtual.value?.id)
  }
  catch (error) {
    console.error('Erro ao baixar PDF:', error)
  }
}
</script>

<template>
  <div
    v-if="loading.item"
    class="d-flex justify-center align-center"
    style="block-size: 400px;"
  >
    <VProgressCircular
      indeterminate
      color="primary"
    />
  </div>

  <div
    v-else-if="!ordemServicoAtual"
    class="text-center pa-8"
  >
    <VIcon
      size="64"
      color="error"
      class="mb-4"
    >
      mdi-file-document-remove
    </VIcon>
    <h3 class="text-h5 mb-2">
      Relatório não encontrado
    </h3>
    <p class="text-body-1 mb-4">
      O relatório solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
    </p>
    <VBtn
      to="/inmetro/dashboard"
      color="primary"
    >
      Voltar ao Dashboard
    </VBtn>
  </div>

  <div
    v-else
    class="relatorio-viewer"
  >
    <!-- Header com ações (apenas em modo não impressão) -->
    <VCard
      v-if="!printMode"
      class="mb-6"
      elevation="2"
    >
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon
            class="me-2"
            size="24"
          >
            tabler-file
          </VIcon>
          <span>Relatório de Inspeção</span>
        </div>
        <div class="d-flex ga-2">
          <VBtn
            variant="outlined"
            color="primary"
            prepend-icon="tabler-printer"
            @click="handlePrint"
          >
            Imprimir
          </VBtn>
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-download"
            @click="handleDownloadPDF"
          >
            Download PDF
          </VBtn>
          <VBtn
            variant="tonal"
            color="default"
            prepend-icon="tabler-arrow-left"
            :to="`/os/visualizar/${ordemServicoAtual.id}`"
          >
            Voltar
          </VBtn>
        </div>
      </VCardTitle>
    </VCard>

    <!-- Conteúdo do relatório -->
    <VCard
      elevation="0"
      class="relatorio-content"
    >
      <VCardText class="pa-8">
        <!-- Cabeçalho do relatório -->
        <div class="text-center mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">
            RELATÓRIO DE INSPEÇÃO
          </h1>
          <div class="text-h6 text-medium-emphasis">
            Número: {{ ordemServicoAtual?.num_relatorio }}
          </div>
        </div>

        <!-- Informações gerais -->
        <VRow class="mb-2">
          <VCol
            cols="12"
            class="pb-0"
          >
            <h2 class="text-h6 font-weight-bold border-bottom">
              INFORMAÇÕES GERAIS
            </h2>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTable
              density="compact"
              class="border rounded"
            >
              <tbody>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Número do Relatório:
                  </td>
                  <td>{{ ordemServicoAtual?.num_relatorio }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Número do Pedido:
                  </td>
                  <td>{{ ordemServicoAtual?.num_pedido_compra || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Data da Inspeção:
                  </td>
                  <td>{{ formatDate(ordemServicoAtual?.data_execucao) }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Responsável:
                  </td>
                  <td>{{ ordemServicoAtual.responsavel?.nome || '-' }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTable
              density="compact"
              class="border rounded"
            >
              <tbody>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Escopo:
                  </td>
                  <td>{{ ordemServicoAtual.escopo_acreditacao?.nome || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Tipo de Serviço:
                  </td>
                  <td>{{ ordemServicoAtual?.tipo_servico?.nome || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Material/Equipamento:
                  </td>
                  <td>{{ ordemServicoAtual.material_equipamento || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Certificado Associado:
                  </td>
                  <td>{{ ordemServicoAtual.certificado_associado || '-' }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>

        <VDivider class="mb-4" />

        <!-- Informações da Ordem de Serviço -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            class="pb-0"
          >
            <h2 class="text-h6 font-weight-bold border-bottom">
              ORDEM DE SERVIÇO
            </h2>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTable
              density="compact"
              class="border rounded"
            >
              <tbody>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Código OS:
                  </td>
                  <td>{{ ordemServicoAtual.codigo }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Cliente:
                  </td>
                  <td>{{ ordemServicoAtual?.cliente?.nome || '-' }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTable
              density="compact"
              class="border rounded"
            >
              <tbody>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Fornecedor:
                  </td>
                  <td>{{ ordemServicoAtual?.fornecedor }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold bg-grey-lighten-5">
                    Data de Abertura:
                  </td>
                  <td>{{ formatDate(ordemServicoAtual?.created_at) }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>

        <VDivider class="mb-4" />

        <!-- Resultado da Inspeção -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            class="pb-0"
          >
            <h2 class="text-h6 font-weight-bold border-bottom">
              RESULTADO DA INSPEÇÃO
            </h2>
          </VCol>

          <VCol cols="12">
            <VChip
              v-if="ordemServicoAtual.resultado"
              :color="getResultadoColor(ordemServicoAtual.resultado)"
              size="large"
              class="text-h6 pa-4"
            >
              {{ ordemServicoAtual.resultado?.toUpperCase() }}
            </VChip>
            <div
              v-else
              class="text-body-1 text-medium-emphasis"
            >
              Resultado não informado
            </div>
          </VCol>
        </VRow>

        <VDivider class="mb-4" />

        <VRow class="mb-4">
          <VCol
            cols="12"
            class="pb-0"
          >
            <h2 class="text-h6 font-weight-bold border-bottom">
              ANEXOS
            </h2>
          </VCol>

          <VCol cols="12">
            <VTable
              density="compact"
              class="border rounded"
            >
              <tbody>
                <tr
                  v-for="(item, index) in ordemServicoAtual.anexos"
                  :key="index"
                >
                  <td>
                    <a
                      :href="item.anexo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ item.nome }}</a>
                  </td>
                  <td class="text-end">
                    <VBtn
                      variant="text"
                      color="primary"
                      prepend-icon="tabler-download"
                      :href="item.anexo"
                      download
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Baixar
                    </VBtn>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>

        <!-- Rodapé -->
        <div class="text-center mt-8 pt-4 border-top">
          <p class="text-body-2 text-medium-emphasis">
            Este relatório foi gerado automaticamente pelo sistema ICV Brasil.
          </p>
          <p class="text-body-2 text-medium-emphasis">
            Data de geração: {{ formatDate(new Date().toISOString()) }}
          </p>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.info-table {
  border: 1px solid rgb(var(--v-border-color));

  td {
    border-block-end: 1px solid rgb(var(--v-border-color));
    padding-block: 8px;
    padding-inline: 12px;

    &:first-child {
      border-inline-end: 1px solid rgb(var(--v-border-color));
      inline-size: 40%;
    }
  }
}

// Estilos para impressão
@media print {
  .relatorio-viewer {
    margin: 0;
    max-inline-size: none;
  }

  .v-card {
    border: none !important;
    box-shadow: none !important;
  }

  .text-h4 {
    font-size: 24px !important;
  }

  .text-h6 {
    font-size: 18px !important;
  }

  .info-table {
    border: 2px solid #000;

    td {
      border-block-end: 1px solid #000;

      &:first-child {
        border-inline-end: 1px solid #000;
      }

      &.bg-grey-lighten-5 {
        background-color: #f5f5f5 !important;
      }
    }
  }
}
</style>
