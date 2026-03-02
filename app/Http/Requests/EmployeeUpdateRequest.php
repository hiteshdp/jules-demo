<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeUpdateRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'sometimes|required|string|min:2',
            'last_name' => 'sometimes|required|string|min:2',
            'email' => 'sometimes|required|email|unique:employees,email,' . $this->route('id'),
            'phone' => 'sometimes|nullable|string',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'status' => 'sometimes|boolean',
        ];
    }
}