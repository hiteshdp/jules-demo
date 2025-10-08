# User Prompt: Add Swagger documentation for admin dashboard API

## User Request
Get dashboard API in admin section, add swagger for this.

## AI Response

I have successfully added comprehensive Swagger documentation for the admin dashboard API. Here's what was implemented:

### ✅ **Swagger Documentation Added**

1. **DashboardStats Schema**:
   - `total_patients` (integer) - Total number of patients
   - `total_dermatologists` (integer) - Total number of dermatologists  
   - `total_appointments` (integer) - Total number of appointments
   - `total_revenue` (float) - Total revenue from completed payments
   - `pending_appointments` (integer) - Number of scheduled appointments
   - `active_subscriptions` (integer) - Number of active subscriptions

2. **MonthlyTrend Schema**:
   - `month` (string) - Month in YYYY-MM format
   - `count` (integer) - Number of appointments for the month
   - `total` (float) - Total revenue for the month

3. **DashboardResponse Schema**:
   - Complete response structure with stats and monthly trends
   - Proper references to other schemas
   - Detailed descriptions for each field

### ✅ **API Endpoint Documentation**

**GET /api/admin/dashboard**
- **Summary**: Get dashboard statistics
- **Description**: Retrieve comprehensive dashboard statistics including patient counts, revenue, appointments, and monthly trends for the last 12 months
- **Tags**: Admin
- **Security**: Bearer token authentication required
- **Responses**:
  - `200` - Dashboard statistics retrieved successfully
  - `401` - Unauthorized (Bearer token required)
  - `500` - Internal server error

### ✅ **Response Structure**

```json
{
  "success": true,
  "data": {
    "stats": {
      "total_patients": 150,
      "total_dermatologists": 25,
      "total_appointments": 500,
      "total_revenue": 25000.50,
      "pending_appointments": 15,
      "active_subscriptions": 120
    },
    "monthly_appointments": [
      {
        "month": "2024-01",
        "count": 45
      }
    ],
    "monthly_revenue": [
      {
        "month": "2024-01", 
        "total": 5000.00
      }
    ]
  }
}
```

### ✅ **Key Features**

1. **Comprehensive Statistics**: 
   - Patient and dermatologist counts
   - Appointment statistics
   - Revenue tracking
   - Subscription status

2. **Monthly Trends**:
   - Last 12 months of appointment data
   - Last 12 months of revenue data
   - Proper date formatting (YYYY-MM)

3. **Security**:
   - Bearer token authentication required
   - Proper error responses for unauthorized access

4. **Error Handling**:
   - 401 Unauthorized response
   - 500 Internal server error response
   - Proper error message formatting

### ✅ **Database Queries**

The dashboard API performs the following database operations:

1. **User Statistics**:
   - Count patients: `User::where('role', 'patient')->count()`
   - Count dermatologists: `User::where('role', 'dermatologist')->count()`

2. **Appointment Statistics**:
   - Total appointments: `Appointment::count()`
   - Pending appointments: `Appointment::where('status', 'scheduled')->count()`

3. **Revenue Statistics**:
   - Total revenue: `Payment::where('status', 'completed')->sum('amount')`
   - Active subscriptions: `Subscription::where('status', 'active')->count()`

4. **Monthly Trends**:
   - Monthly appointments: `Appointment::select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('COUNT(*) as count'))`
   - Monthly revenue: `Payment::select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(amount) as total'))`

### ✅ **Files Modified**
- `app/Http/Controllers/Api/AdminController.php` - Added comprehensive Swagger documentation
- `routes/api.php` - Dashboard route properly registered

### ✅ **Swagger Documentation Quality**
- **Professional Standards**: Follows OpenAPI 3.0 specifications
- **Detailed Schemas**: Custom schemas for all response structures
- **Security Documentation**: Bearer token authentication
- **Error Handling**: Complete error response documentation
- **Examples**: Realistic examples for all fields
- **Descriptions**: Detailed descriptions for all properties

The admin dashboard API now has complete Swagger documentation that will generate comprehensive API documentation, making it easy for developers to understand and integrate with the dashboard endpoint.
