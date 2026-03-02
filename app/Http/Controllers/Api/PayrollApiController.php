<?php
namespace App\Http\Controllers\Api;

use App\Http\Requests\PayrollStoreRequest;
use App\Http\Requests\PayrollUpdateRequest;
use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $payrolls = Payroll::paginate(10);
        return response()->json($payrolls);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\PayrollStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PayrollStoreRequest $request)
    {
        $payroll = Payroll::create($request->validated());
        return response()->json($payroll, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function show(Payroll $payroll)
    {
        return response()->json($payroll);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\PayrollUpdateRequest  $request
     * @param  \App\Models\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function update(PayrollUpdateRequest $request, Payroll $payroll)
    {
        $payroll->update($request->validated());
        return response()->json($payroll);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return response()->json(['message' => 'Payroll deleted successfully'], 200);
    }
}