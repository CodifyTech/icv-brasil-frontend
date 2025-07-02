<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class OrdemServico extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ordens_servico';

    protected $fillable = [
        'codigo',
        'cliente_id',
        'fornecedor',
        'num_pedido_compra',
        'num_relatorio',
        'descritivo',
        'responsavel_id',
        'perfil_responsavel_id',
        'escopo_acreditacao_id',
        'tipo_servico_id',
        'data_execucao',
        'certificado_associado',
        'resultado',
        'status',
        'observacoes',
        'motivo_reprovacao',
        'observacoes_reprovacao',
        'data_reprovacao',
        'data_finalizacao',
        'finalizada_por',
        'reprovada_por',
    ];

    protected $casts = [
        'data_execucao' => 'date',
        'data_reprovacao' => 'datetime',
        'data_finalizacao' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    protected $with = [];

    /**
     * Relacionamento com Cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relacionamento com Funcionário (Responsável)
     */
    public function responsavel(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class, 'responsavel_id');
    }

    /**
     * Relacionamento com Escopo de Acreditação
     */
    public function escopo_acreditacao(): BelongsTo
    {
        return $this->belongsTo(EscopoAcreditacao::class, 'escopo_acreditacao_id');
    }

    /**
     * Relacionamento com Tipo de Serviço
     */
    public function tipo_servico(): BelongsTo
    {
        return $this->belongsTo(TipoServico::class, 'tipo_servico_id');
    }

    /**
     * Relacionamento com Anexos
     */
    public function anexos(): HasMany
    {
        return $this->hasMany(OrdemServicoAnexo::class, 'ordem_servico_id');
    }

    /**
     * Relacionamento com Materiais/Equipamentos
     */
    public function materialEquipamentos(): HasMany
    {
        return $this->hasMany(MaterialEquipamento::class, 'ordem_servico_id');
    }

    /**
     * Relacionamento com usuário que finalizou
     */
    public function finalizadaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalizada_por');
    }

    /**
     * Relacionamento com usuário que reprovou
     */
    public function reprovadaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reprovada_por');
    }

    /**
     * Scopes
     */
    public function scopeFinalizadas($query)
    {
        return $query->where('status', 'finalizada');
    }

    public function scopeReprovadas($query)
    {
        return $query->where('status', 'reprovada');
    }

    public function scopeEmAndamento($query)
    {
        return $query->whereIn('status', ['em_analise', 'andamento']);
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        $labels = [
            'em_analise' => 'Em Análise',
            'andamento' => 'Em Andamento',
            'finalizada' => 'Finalizada',
            'reprovada' => 'Reprovada',
        ];

        return $labels[$this->status] ?? 'Desconhecido';
    }

    public function getResultadoLabelAttribute(): ?string
    {
        if (!$this->resultado) {
            return null;
        }

        $labels = [
            'aprovado' => 'Aprovado',
            'reprovado' => 'Reprovado',
            'aprovado_com_restricoes' => 'Aprovado com Restrições',
        ];

        return $labels[$this->resultado] ?? $this->resultado;
    }

    /**
     * Verificar se a OS pode ser finalizada
     */
    public function podeSerFinalizada(): bool
    {
        return in_array($this->status, ['em_analise', 'andamento']);
    }

    /**
     * Verificar se a OS pode ser reprovada
     */
    public function podeSerReprovada(): bool
    {
        return in_array($this->status, ['em_analise', 'andamento']);
    }

    /**
     * Verificar se a OS está finalizada
     */
    public function estahFinalizada(): bool
    {
        return $this->status === 'finalizada';
    }

    /**
     * Verificar se a OS está reprovada
     */
    public function estahReprovada(): bool
    {
        return $this->status === 'reprovada';
    }

    /**
     * Boot method para adicionar observers
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ordemServico) {
            if (empty($ordemServico->codigo)) {
                $ordemServico->codigo = self::gerarCodigo();
            }
        });
    }

    /**
     * Gerar código único para a OS
     */
    private static function gerarCodigo(): string
    {
        $year = Carbon::now()->year;
        $lastOS = self::withTrashed()
            ->where('codigo', 'like', "OS-{$year}-%")
            ->orderBy('codigo', 'desc')
            ->first();

        if ($lastOS) {
            $lastNumber = (int) substr($lastOS->codigo, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('OS-%d-%04d', $year, $newNumber);
    }
}
