<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Company;
use App\Models\Job;
use App\Models\Application;
use App\Models\Contract;
use App\Models\Review;
use App\Models\Report;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get platform statistics
     */
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_students' => Student::count(),
                'total_companies' => Company::count(),
                'verified_students' => Student::where('verification_status', 'approved')->count(),
                'verified_companies' => Company::where('verification_status', 'approved')->count(),
                'pending_student_verifications' => Student::where('verification_status', 'pending')->count(),
                'pending_company_verifications' => Company::where('verification_status', 'pending')->count(),
                'total_jobs' => Job::count(),
                'active_jobs' => Job::where('status', 'active')->count(),
                'pending_jobs' => Job::where('status', 'pending')->count(),
                'total_applications' => Application::count(),
            ]
        ]);
    }

    /**
     * Get single user details
     */
    public function getUser($id)
    {
        $user = User::with(['student', 'company'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Get all users with filters
     */
    public function users(Request $request)
    {
        $query = User::with(['student', 'company']);

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->is_verified !== null) {
            $query->where('is_verified', $request->is_verified);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->latest('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get pending verifications
     */
    public function pendingVerifications()
    {
        $students = Student::where('verification_status', 'pending')
            ->with('user')
            ->get();

        $companies = Company::where('verification_status', 'pending')
            ->with('user')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'students' => $students,
                'companies' => $companies
            ]
        ]);
    }

    /**
     * Get pending jobs
     */
    public function pendingJobs()
    {
        $jobs = Job::where('status', 'pending')
            ->with(['company.user', 'category'])
            ->latest('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Verify student
     */
    public function verifyStudent(Request $request, $studentId)
    {
        $student = Student::findOrFail($studentId);
        
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $student->update([
            'verification_status' => $request->status
        ]);

        // Update user verification
        if ($request->status === 'approved') {
            $student->user->update([
                'is_verified' => 1,
                'verification_badge' => 1
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Student {$request->status} successfully"
        ]);
    }

    /**
     * Verify company
     */
    public function verifyCompany(Request $request, $companyId)
    {
        $company = Company::findOrFail($companyId);
        
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $company->update([
            'verification_status' => $request->status
        ]);

        // Update user verification
        if ($request->status === 'approved') {
            $company->user->update([
                'is_verified' => 1,
                'verification_badge' => 1
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Company {$request->status} successfully"
        ]);
    }

    /**
     * Get all jobs for moderation
     */
    public function jobs(Request $request)
    {
        $query = Job::with(['company.user', 'category']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $jobs = $query->latest('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Approve/Reject job
     */
    public function moderateJob(Request $request, $jobId)
    {
        $job = Job::findOrFail($jobId);
        
        $request->validate([
            'status' => 'required|in:active,rejected',
            'admin_notes' => 'nullable|string'
        ]);

        $job->update([
            'status' => $request->status,
            'published_at' => $request->status === 'active' ? now() : null
        ]);

        return response()->json([
            'success' => true,
            'message' => "Job {$request->status} successfully"
        ]);
    }

    /**
     * Toggle featured job
     */
    public function toggleFeatured(Request $request, $jobId)
    {
        $job = Job::findOrFail($jobId);
        
        $job->update([
            'is_featured' => !$job->is_featured
        ]);

        return response()->json([
            'success' => true,
            'message' => $job->is_featured ? 'Job featured' : 'Job unfeatured'
        ]);
    }

    /**
     * Toggle urgent job
     */
    public function toggleUrgent(Request $request, $jobId)
    {
        $job = Job::findOrFail($jobId);
        
        $job->update([
            'is_urgent' => !$job->is_urgent
        ]);

        return response()->json([
            'success' => true,
            'message' => $job->is_urgent ? 'Job marked as urgent' : 'Job unmarked as urgent'
        ]);
    }

    /**
     * Get all reports
     */
    public function reports(Request $request)
    {
        $query = Report::with(['reporter', 'reported']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $reports = $query->latest('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Handle report
     */
    public function handleReport(Request $request, $reportId)
    {
        $report = Report::findOrFail($reportId);
        
        $request->validate([
            'status' => 'required|in:reviewing,resolved,dismissed',
            'admin_notes' => 'nullable|string'
        ]);

        $report->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report updated successfully'
        ]);
    }

    /**
     * Deactivate/Activate user
     */
    public function toggleUserStatus(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        
        $user->update([
            'is_active' => !$user->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'User activated' : 'User deactivated'
        ]);
    }

    /**
     * Get detailed analytics data with time range support
     */
    public function analytics(Request $request)
    {
        try {
            $range = $request->get('range', 'week'); // week, month, year
            
            // Calculate date range
            $startDate = match($range) {
                'week' => now()->subDays(7),
                'month' => now()->subDays(30),
                'year' => now()->subYear(),
                default => now()->subDays(7)
            };

            // Overview Statistics
            $overview = [
                'totalUsers' => User::count(),
                'totalJobs' => Job::count(),
                'totalApplications' => Application::count(),
                'activeJobs' => Job::where('status', 'active')->count(),
                'newUsersThisWeek' => User::where('created_at', '>=', now()->subDays(7))->count(),
                'newJobsThisWeek' => Job::where('created_at', '>=', now()->subDays(7))->count(),
                'applicationRate' => $this->calculateApplicationRate(),
                'verifiedCompanies' => Company::where('verification_status', 'approved')->count(),
            ];

            // User Growth (last 7/30/365 days)
            $userGrowth = [];
            $days = match($range) {
                'week' => 7,
                'month' => 30,
                'year' => 12, // months for year view
                default => 7
            };

            if ($range === 'year') {
                // Monthly data for year
                for ($i = $days - 1; $i >= 0; $i--) {
                    $date = now()->subMonths($i);
                    $userGrowth[] = [
                        'date' => $date->format('M'),
                        'users' => User::whereYear('created_at', $date->year)
                            ->whereMonth('created_at', $date->month)
                            ->count()
                    ];
                }
            } else {
                // Daily data for week/month
                for ($i = $days - 1; $i >= 0; $i--) {
                    $date = now()->subDays($i);
                    $userGrowth[] = [
                        'date' => $date->format('M d'),
                        'users' => User::whereDate('created_at', $date)->count()
                    ];
                }
            }

            // Job Statistics by Category, Type, and Work Mode
            $jobStats = [
                'byCategory' => DB::table('jobs')
                    ->join('categories', 'jobs.category_id', '=', 'categories.category_id')
                    ->select('categories.name', DB::raw('count(*) as count'))
                    ->groupBy('categories.name')
                    ->get(),
                
                'byType' => DB::table('jobs')
                    ->select('job_type as type', DB::raw('count(*) as count'))
                    ->groupBy('job_type')
                    ->get(),
                
                'byWorkMode' => DB::table('jobs')
                    ->select('work_mode as mode', DB::raw('count(*) as count'))
                    ->groupBy('work_mode')
                    ->get(),
            ];

            // Application Statistics
            $applicationStats = [
                'byStatus' => DB::table('applications')
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                
                'avgResponseTime' => $this->calculateAvgResponseTime(),
            ];

            // Top 5 Companies by Applications
            $topCompanies = DB::table('companies')
                ->join('users', 'companies.user_id', '=', 'users.user_id')
                ->leftJoin('jobs', 'companies.company_id', '=', 'jobs.company_id')
                ->leftJoin('applications', 'jobs.job_id', '=', 'applications.job_id')
                ->select(
                    'users.name',
                    DB::raw('COUNT(DISTINCT jobs.job_id) as jobsPosted'),
                    DB::raw('COUNT(applications.application_id) as applications')
                )
                ->groupBy('companies.company_id', 'users.name')
                ->orderBy('applications', 'desc')
                ->limit(5)
                ->get();

            // Top 5 Categories by Job Count
            $topCategories = DB::table('categories')
                ->leftJoin('jobs', 'categories.category_id', '=', 'jobs.category_id')
                ->select(
                    'categories.name',
                    'categories.icon',
                    DB::raw('COUNT(jobs.job_id) as jobCount')
                )
                ->groupBy('categories.category_id', 'categories.name', 'categories.icon')
                ->orderBy('jobCount', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => $overview,
                    'userGrowth' => $userGrowth,
                    'jobStats' => $jobStats,
                    'applicationStats' => $applicationStats,
                    'topCompanies' => $topCompanies,
                    'topCategories' => $topCategories,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate application acceptance rate
     */
    private function calculateApplicationRate()
    {
        $total = Application::count();
        if ($total === 0) return 0;
        
        $accepted = Application::where('status', 'accepted')->count();
        return round(($accepted / $total) * 100, 1);
    }

    /**
     * Calculate average response time in hours
     */
    private function calculateAvgResponseTime()
    {
        $applications = Application::whereNotNull('reviewed_at')
            ->whereNotNull('applied_at')
            ->get();
        
        if ($applications->isEmpty()) return 0;
        
        $totalHours = 0;
        foreach ($applications as $app) {
            $hours = $app->applied_at->diffInHours($app->reviewed_at);
            $totalHours += $hours;
        }
        
        return round($totalHours / $applications->count(), 1);
    }

    /**
     * Get users trend (backward compatibility)
     */
    private function getUsersTrend($days)
    {
        return User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Get jobs trend (backward compatibility)
     */
    private function getJobsTrend($days)
    {
        return Job::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Get applications trend (backward compatibility)
     */
    private function getApplicationsTrend($days)
    {
        return Application::selectRaw('DATE(applied_at) as date, COUNT(*) as count')
            ->whereRaw('applied_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Get top categories (backward compatibility)
     */
    private function getTopCategories()
    {
        return Job::selectRaw('category_id, COUNT(*) as job_count')
            ->with('category')
            ->groupBy('category_id')
            ->orderByDesc('job_count')
            ->limit(10)
            ->get();
    }

    /**
     * Get top companies (backward compatibility)
     */
    private function getTopCompanies()
    {
        return Company::with('user')
            ->orderByDesc('total_jobs_posted')
            ->limit(10)
            ->get();
    }

    /**
     * Get top students (backward compatibility)
     */
    private function getTopStudents()
    {
        return Student::with('user')
            ->where('rating', '>', 0)
            ->orderByDesc('rating')
            ->orderByDesc('completed_jobs')
            ->limit(10)
            ->get();
    }
}