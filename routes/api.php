<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PayrollApiController;

Route::apiResource('payrolls', PayrollApiController::class);