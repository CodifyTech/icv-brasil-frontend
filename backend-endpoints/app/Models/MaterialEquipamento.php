<?php

namespace Domains\OS\Models;

use Domains\Shared\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OSMaterialEquipamento extends BaseModel
{
    protected $fillable = [
        'id',
        'descricao',
        'ordem_servico_id',
    ];

    protected $list = [
        'id',
        'descricao',
        'ordem_servico_id',
    ];

    protected $table = 'ordem_servico_material_equipamentos';

    public function ordemServico(): BelongsTo
    {
        return $this->belongsTo(OS::class, 'ordem_servico_id');
    }
}
