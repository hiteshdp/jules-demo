<?php
// Generated via prompt: prompts/admin_subscription_management_v1.md

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * @OA\Tag(
 *   name="Admin Subscription Management",
 *   description="Admin APIs for managing subscriptions"
 * )
 */
class AdminSubscriptionController extends Controller
{
    /**
     * Get all subscriptions with filters
     *
     * @OA\Get(
     *   path="/admin/subscriptions",
     *   tags={"Admin Subscription Management"},
     *   security={{"sanctum": {}}},
     *   summary="Get all subscriptions with filters",
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     description="Filter by subscription status",
     *     @OA\Schema(type="string", enum={"active", "cancelled", "expired", "pending"})
     *   ),
     *   @OA\Parameter(
     *     name="patient_name",
     *     in="query",
     *     description="Filter by patient name"
     *   ),
     *   @OA\Parameter(
     *     name="date_from",
     *     in="query",
     *     description="Filter from date (YYYY-MM-DD)"
     *   ),
     *   @OA\Parameter(
     *     name="date_to",
     *     in="query",
     *     description="Filter to date (YYYY-MM-DD)"
     *   ),
     *   @OA\Parameter(
     *     name="per_page",
     *     in="query",
     *     description="Items per page",
     *     @OA\Schema(type="integer", default=15)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Subscriptions retrieved successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="data", type="object",
     *         @OA\Property(property="subscriptions", type="array", @OA\Items(type="object")),
     *         @OA\Property(property="pagination", type="object")
     *       )
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $query = Subscription::with(['user', 'payments'])
            ->select('subscriptions.*')
            ->leftJoin('users', 'subscriptions.user_id', '=', 'users.id')
            ->leftJoin('payments', function ($join) {
                $join->on('subscriptions.id', '=', 'payments.payable_id')
                    ->where('payments.payable_type', '=', Subscription::class);
            });

        // Apply filters
        if ($request->filled('status')) {
            $query->where('subscriptions.status', $request->status);
        }

        if ($request->filled('patient_name')) {
            $query->where('users.name', 'like', '%' . $request->patient_name . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('subscriptions.created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('subscriptions.created_at', '<=', $request->date_to);
        }


        $perPage = $request->get('per_page', 15);
        $subscriptions = $query->orderBy('subscriptions.created_at', 'desc')
            ->paginate($perPage);

        // Transform data to include payment information
        $subscriptions->getCollection()->transform(function ($subscription) {
            $latestPayment = $subscription->payments()->latest()->first();
            $subscription->last_payment_date = $latestPayment ? $latestPayment->paid_at : null;
            $subscription->total_payments = $subscription->payments()->where('status', 'completed')->count();
            $subscription->total_amount_paid = $subscription->payments()->where('status', 'completed')->sum('amount');

            return $subscription;
        });

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * Get subscription details
     *
     * @OA\Get(
     *   path="/admin/subscriptions/{id}",
     *   tags={"Admin Subscription Management"},
     *   security={{"sanctum": {}}},
     *   summary="Get subscription details",
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="Subscription ID"
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Subscription details retrieved successfully"
     *   ),
     *   @OA\Response(
     *     response=404,
     *     description="Subscription not found"
     *   )
     * )
     */
    public function show($id)
    {
        $subscription = Subscription::with(['user', 'payments' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found'
            ], 404);
        }

        // Add calculated fields
        $subscription->total_payments = $subscription->payments()->where('status', 'completed')->count();
        $subscription->total_amount_paid = $subscription->payments()->where('status', 'completed')->sum('amount');
        $subscription->next_payment_due = $subscription->next_billing_date ?? $subscription->ends_at;

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }



    /**
     * Get subscription statistics
     *
     * @OA\Get(
     *   path="/admin/subscriptions/statistics",
     *   tags={"Admin Subscription Management"},
     *   security={{"sanctum": {}}},
     *   summary="Get subscription statistics",
     *   @OA\Response(
     *     response=200,
     *     description="Statistics retrieved successfully"
     *   )
     * )
     */
    public function statistics()
    {
        $stats = [
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'cancelled_subscriptions' => Subscription::where('status', 'cancelled')->count(),
            'expired_subscriptions' => Subscription::where('status', 'expired')->count(),
            'pending_subscriptions' => Subscription::where('status', 'pending')->count(),
            'total_revenue' => Payment::where('payable_type', Subscription::class)
                ->where('status', 'completed')
                ->sum('amount'),
            'monthly_revenue' => Payment::where('payable_type', Subscription::class)
                ->where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
