<?php

namespace App\Http\Controllers;

use App\Models\OrdemServico;
use App\Models\OrdemServicoAnexo;
use App\Models\MaterialEquipamento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OrdemServicoController extends Controller
{
    /**
     * Finalizar uma ordem de serviço
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function finalizar(Request $request, string $id): JsonResponse
    {
        try {
            $ordemServico = OrdemServico::findOrFail($id);

            // Validar se a OS pode ser finalizada
            if (!in_array($ordemServico->status, ['em_analise', 'andamento'])) {
                return response()->json([
                    'message' => 'Esta ordem de serviço não pode ser finalizada no status atual.',
                    'error' => 'INVALID_STATUS'
                ], 422);
            }

            // Validar dados obrigatórios para finalização
            $validatedData = $request->validate([
                'num_relatorio' => 'required|string|max:255',
                'data_execucao' => 'required|date',
                'certificado_associado' => 'nullable|string|max:255',
                'resultado' => 'required|in:aprovado,reprovado,aprovado_com_restricoes',
                'observacoes' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // Atualizar os dados da ordem de serviço
            $ordemServico->update([
                'num_relatorio' => $validatedData['num_relatorio'],
                'data_execucao' => $validatedData['data_execucao'],
                'certificado_associado' => $validatedData['certificado_associado'] ?? null,
                'resultado' => $validatedData['resultado'],
                'observacoes' => $validatedData['observacoes'] ?? null,
                'status' => 'finalizada',
                'data_finalizacao' => Carbon::now(),
                'finalizada_por' => auth()->id(),
            ]);

            // Carregar relacionamentos para retorno
            $ordemServico->load([
                'cliente:id,nome_fantasia',
                'responsavel:id,nome',
                'escopo_acreditacao:id,nome',
                'tipo_servico:id,nome',
                'anexos',
                'materialEquipamentos'
            ]);

            DB::commit();

            Log::info("Ordem de serviço {$id} finalizada com sucesso", [
                'user_id' => auth()->id(),
                'os_id' => $id,
                'resultado' => $validatedData['resultado']
            ]);

            return response()->json([
                'message' => 'Ordem de serviço finalizada com sucesso.',
                'data' => $ordemServico
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Dados inválidos para finalização.',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro ao finalizar ordem de serviço {$id}: " . $e->getMessage(), [
                'user_id' => auth()->id(),
                'os_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erro interno do servidor ao finalizar ordem de serviço.',
                'error' => config('app.debug') ? $e->getMessage() : 'INTERNAL_ERROR'
            ], 500);
        }
    }

    /**
     * Reprovar uma ordem de serviço
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function reprovar(Request $request, string $id): JsonResponse
    {
        try {
            $ordemServico = OrdemServico::findOrFail($id);

            // Validar se a OS pode ser reprovada
            if (!in_array($ordemServico->status, ['em_analise', 'andamento'])) {
                return response()->json([
                    'message' => 'Esta ordem de serviço não pode ser reprovada no status atual.',
                    'error' => 'INVALID_STATUS'
                ], 422);
            }

            // Validar dados obrigatórios para reprovação
            $validatedData = $request->validate([
                'motivo_reprovacao' => 'required|string|max:1000',
                'observacoes_reprovacao' => 'nullable|string',
                'data_reprovacao' => 'required|date',
            ]);

            DB::beginTransaction();

            // Atualizar os dados da ordem de serviço
            $ordemServico->update([
                'motivo_reprovacao' => $validatedData['motivo_reprovacao'],
                'observacoes_reprovacao' => $validatedData['observacoes_reprovacao'] ?? null,
                'data_reprovacao' => $validatedData['data_reprovacao'],
                'status' => 'reprovada',
                'reprovada_por' => auth()->id(),
            ]);

            // Carregar relacionamentos para retorno
            $ordemServico->load([
                'cliente:id,nome_fantasia',
                'responsavel:id,nome',
                'escopo_acreditacao:id,nome',
                'tipo_servico:id,nome',
                'anexos',
                'materialEquipamentos'
            ]);

            DB::commit();

            Log::info("Ordem de serviço {$id} reprovada com sucesso", [
                'user_id' => auth()->id(),
                'os_id' => $id,
                'motivo' => $validatedData['motivo_reprovacao']
            ]);

            return response()->json([
                'message' => 'Ordem de serviço reprovada com sucesso.',
                'data' => $ordemServico
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Dados inválidos para reprovação.',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro ao reprovar ordem de serviço {$id}: " . $e->getMessage(), [
                'user_id' => auth()->id(),
                'os_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erro interno do servidor ao reprovar ordem de serviço.',
                'error' => config('app.debug') ? $e->getMessage() : 'INTERNAL_ERROR'
            ], 500);
        }
    }

    /**
     * Buscar anexos de uma ordem de serviço
     *
     * @param string $id
     * @return JsonResponse
     */
    public function buscarAnexos(string $id): JsonResponse
    {
        try {
            $ordemServico = OrdemServico::findOrFail($id);

            $anexos = OrdemServicoAnexo::where('ordem_servico_id', $id)
                ->select([
                    'id',
                    'nome',
                    'anexo',
                    'tipo',
                    'inmetro_flag',
                    'tamanho',
                    'created_at'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($anexo) {
                    return [
                        'id' => $anexo->id,
                        'nome' => $anexo->nome,
                        'anexo' => $anexo->anexo,
                        'tipo' => $anexo->tipo ?? $this->getFileType($anexo->nome),
                        'inmetro_flag' => (bool) $anexo->inmetro_flag,
                        'tamanho' => $anexo->tamanho,
                        'data_upload' => $anexo->created_at->format('d/m/Y H:i:s'),
                    ];
                });

            return response()->json([
                'message' => 'Anexos carregados com sucesso.',
                'data' => $anexos
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erro ao buscar anexos da ordem de serviço {$id}: " . $e->getMessage());

            return response()->json([
                'message' => 'Erro ao buscar anexos da ordem de serviço.',
                'error' => config('app.debug') ? $e->getMessage() : 'INTERNAL_ERROR'
            ], 500);
        }
    }

    /**
     * Buscar materiais/equipamentos de uma ordem de serviço
     *
     * @param string $id
     * @return JsonResponse
     */
    public function buscarMateriais(string $id): JsonResponse
    {
        try {
            $ordemServico = OrdemServico::findOrFail($id);

            $materiaisEquipamentos = MaterialEquipamento::where('ordem_servico_id', $id)
                ->select([
                    'id',
                    'descricao',
                    'quantidade',
                    'unidade',
                    'valor_unitario',
                    'valor_total',
                    'observacoes',
                    'created_at'
                ])
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($material) {
                    return [
                        'id' => $material->id,
                        'descricao' => $material->descricao,
                        'quantidade' => $material->quantidade,
                        'unidade' => $material->unidade,
                        'valor_unitario' => $material->valor_unitario,
                        'valor_total' => $material->valor_total,
                        'observacoes' => $material->observacoes,
                        'data_cadastro' => $material->created_at->format('d/m/Y H:i:s'),
                    ];
                });

            return response()->json([
                'message' => 'Materiais e equipamentos carregados com sucesso.',
                'data' => $materiaisEquipamentos
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erro ao buscar materiais da ordem de serviço {$id}: " . $e->getMessage());

            return response()->json([
                'message' => 'Erro ao buscar materiais da ordem de serviço.',
                'error' => config('app.debug') ? $e->getMessage() : 'INTERNAL_ERROR'
            ], 500);
        }
    }

    /**
     * Determinar tipo do arquivo baseado na extensão
     *
     * @param string $filename
     * @return string
     */
    private function getFileType(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        $types = [
            'pdf' => 'PDF',
            'doc' => 'DOC',
            'docx' => 'DOCX',
            'xls' => 'XLS',
            'xlsx' => 'XLSX',
            'jpg' => 'IMG',
            'jpeg' => 'IMG',
            'png' => 'IMG',
            'gif' => 'IMG',
            'zip' => 'ZIP',
            'rar' => 'RAR',
        ];

        return $types[$extension] ?? 'ARQUIVO';
    }
}
