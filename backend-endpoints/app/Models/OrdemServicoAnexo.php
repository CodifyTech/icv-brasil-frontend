<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrdemServicoAnexo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ordem_servico_anexos';

    protected $fillable = [
        'ordem_servico_id',
        'nome',
        'anexo',
        'tipo',
        'inmetro_flag',
        'tamanho',
        'mime_type',
        'upload_por',
    ];

    protected $casts = [
        'inmetro_flag' => 'boolean',
        'tamanho' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    /**
     * Relacionamento com Ordem de Serviço
     */
    public function ordemServico(): BelongsTo
    {
        return $this->belongsTo(OrdemServico::class, 'ordem_servico_id');
    }

    /**
     * Relacionamento com usuário que fez upload
     */
    public function uploadPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'upload_por');
    }

    /**
     * Accessors
     */
    public function getUrlAnexoAttribute(): string
    {
        if (filter_var($this->anexo, FILTER_VALIDATE_URL)) {
            return $this->anexo;
        }

        return asset('storage/' . $this->anexo);
    }

    public function getTamanhoFormatadoAttribute(): string
    {
        if (!$this->tamanho) {
            return 'N/A';
        }

        $bytes = $this->tamanho;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Scopes
     */
    public function scopeInmetro($query)
    {
        return $query->where('inmetro_flag', true);
    }

    public function scopePorTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($anexo) {
            if (auth()->check()) {
                $anexo->upload_por = auth()->id();
            }
        });
    }
}
