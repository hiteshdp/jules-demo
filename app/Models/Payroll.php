<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'month',
        'basic_salary',
        'hra',
        'allowances',
        'deductions',
        'tax',
        'net_salary',
        'remarks',
        'status',
    ];

    /**
     * Get the employee that owns the payroll.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}