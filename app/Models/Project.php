<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'manager_id',
        'budget',
    ];

    /**
     * Get the manager that is assigned to the project.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Employee::class, 'manager_id');
    }
}