<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayrollStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|date_format:Y-m',
            'basic_salary' => 'required|numeric|min:0',
            'hra' => 'nullable|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'net_salary' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'status' => 'in:generated,approved,paid',
        ];
    }
}