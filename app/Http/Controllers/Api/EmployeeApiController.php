<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(
 *     name="Employees",
 *     description="Employee resource API"
 * )
 *
 * @OA\Schema(
 *     schema="Employee",
 *     type="object",
 *     required={"first_name", "last_name", "email"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="first_name", type="string", minLength=2, example="John"),
 *     @OA\Property(property="last_name", type="string", minLength=2, example="Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="phone", type="string", nullable=true, example="+1234567890"),
 *     @OA\Property(property="department_id", type="integer", nullable=true, example=1),
 *     @OA\Property(property="status", type="boolean", example=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="EmployeeStoreRequest",
 *     type="object",
 *     required={"first_name", "last_name", "email"},
 *     @OA\Property(property="first_name", type="string", minLength=2, example="John"),
 *     @OA\Property(property="last_name", type="string", minLength=2, example="Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="department_id", type="integer", nullable=true),
 *     @OA\Property(property="status", type="boolean", nullable=true)
 * )
 *
 * @OA\Schema(
 *     schema="EmployeeUpdateRequest",
 *     type="object",
 *     @OA\Property(property="first_name", type="string", minLength=2),
 *     @OA\Property(property="last_name", type="string", minLength=2),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="department_id", type="integer", nullable=true),
 *     @OA\Property(property="status", type="boolean", nullable=true)
 * )
 *
 * Validation errors use the shared ValidationError schema (see components/schemas).
 */
class EmployeeApiController extends Controller
{
    /**
     * List employees (paginated).
     *
     * @OA\Get(
     *     path="/employees",
     *     tags={"Employees"},
     *     summary="List all employees",
     *     description="Returns a paginated list of employees (10 per page).",
     *     @OA\Response(response=200, description="Successful operation", @OA\JsonContent(
     *         type="object",
     *         @OA\Property(property="current_page", type="integer"),
     *         @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Employee")),
     *         @OA\Property(property="first_page_url", type="string"),
     *         @OA\Property(property="from", type="integer", nullable=true),
     *         @OA\Property(property="last_page", type="integer"),
     *         @OA\Property(property="last_page_url", type="string"),
     *         @OA\Property(property="links", type="array", @OA\Items(type="object")),
     *         @OA\Property(property="next_page_url", type="string", nullable=true),
     *         @OA\Property(property="path", type="string"),
     *         @OA\Property(property="per_page", type="integer"),
     *         @OA\Property(property="prev_page_url", type="string", nullable=true),
     *         @OA\Property(property="to", type="integer", nullable=true),
     *         @OA\Property(property="total", type="integer")
     *     ))
     * )
     */
    public function index()
    {
        $employees = Employee::paginate(10);
        return response()->json($employees);
    }

    /**
     * Get a single employee by ID.
     *
     * @OA\Get(
     *     path="/employees/{id}",
     *     tags={"Employees"},
     *     summary="Get employee by ID",
     *     description="Returns a single employee.",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/Employee")),
     *     @OA\Response(response=404, description="Employee not found", @OA\JsonContent(
     *         type="object", @OA\Property(property="message", type="string", example="Employee not found")
     *     ))
     * )
     */
    public function show($id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        return response()->json($employee);
    }

    /**
     * Create a new employee.
     *
     * @OA\Post(
     *     path="/employees",
     *     tags={"Employees"},
     *     summary="Create employee",
     *     description="Create a new employee. Validates: first_name/last_name (required, min 2), email (required, unique), phone (optional), department_id (optional, must exist in departments), status (optional boolean).",
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/EmployeeStoreRequest")),
     *     @OA\Response(response=201, description="Employee created", @OA\JsonContent(ref="#/components/schemas/Employee")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function store(EmployeeStoreRequest $request)
    {
        $employee = Employee::create($request->validated());
        return response()->json($employee, 201);
    }

    /**
     * Update an employee.
     *
     * @OA\Put(
     *     path="/employees/{id}",
     *     tags={"Employees"},
     *     summary="Update employee",
     *     description="Update an existing employee. All fields are optional (partial update). Same validation rules as create for provided fields; email must be unique excluding current record.",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/EmployeeUpdateRequest")),
     *     @OA\Response(response=200, description="Employee updated", @OA\JsonContent(ref="#/components/schemas/Employee")),
     *     @OA\Response(response=404, description="Employee not found", @OA\JsonContent(
     *         type="object", @OA\Property(property="message", type="string", example="Employee not found")
     *     )),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function update(EmployeeUpdateRequest $request, $id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        $employee->update($request->validated());
        return response()->json($employee);
    }

    /**
     * Delete an employee.
     *
     * @OA\Delete(
     *     path="/employees/{id}",
     *     tags={"Employees"},
     *     summary="Delete employee",
     *     description="Delete an employee by ID.",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Employee deleted", @OA\JsonContent(
     *         type="object", @OA\Property(property="message", type="string", example="Employee deleted successfully")
     *     )),
     *     @OA\Response(response=404, description="Employee not found", @OA\JsonContent(
     *         type="object", @OA\Property(property="message", type="string", example="Employee not found")
     *     ))
     * )
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    }
}