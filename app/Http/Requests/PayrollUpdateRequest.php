<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayrollUpdateRequest extends FormRequest
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
            'employee_id' => 'sometimes|required|exists:employees,id',
            'month' => 'sometimes|required|date_format:Y-m',
            'basic_salary' => 'sometimes|required|numeric|min:0',
            'hra' => 'sometimes|nullable|numeric|min:0',
            'allowances' => 'sometimes|nullable|numeric|min:0',
            'deductions' => 'sometimes|nullable|numeric|min:0',
            'tax' => 'sometimes|nullable|numeric|min:0',
            'net_salary' => 'sometimes|required|numeric|min:0',
            'remarks' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:generated,approved,paid',
        ];
    }
}