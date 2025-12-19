<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Application;
use App\Models\SavedJob;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    /**
     * Get all jobs (public - with filters)
     */
    public function index(Request $request)
    {
        $query = Job::with(['company.user', 'category'])
            ->where('status', 'active');

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Filter by job type
        if ($request->job_type) {
            $query->where('job_type', $request->job_type);
        }

        // Filter by payment type
        if ($request->payment_type) {
            $query->where('payment_type', $request->payment_type);
        }

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by location
        if ($request->location) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by work mode
        if ($request->work_mode) {
            $query->where('work_mode', $request->work_mode);
        }

        // Filter by budget range
        if ($request->min_budget) {
            $query->where('budget_min', '>=', $request->min_budget);
        }
        if ($request->max_budget) {
            $query->where('budget_max', '<=', $request->max_budget);
        }

        // Filter by hourly rate
        if ($request->hourly_rate_min) {
            $query->where('hourly_rate', '>=', $request->hourly_rate_min);
        }
        if ($request->hourly_rate_max) {
            $query->where('hourly_rate', '<=', $request->hourly_rate_max);
        }

        // Urgent jobs only
        if ($request->urgent) {
            $query->where('is_urgent', 1);
        }

        // Featured jobs only
        if ($request->featured) {
            $query->where('is_featured', 1);
        }

        // Sort
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $jobs = $query->paginate($request->per_page ?? 12);

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Get single job details
     */
    public function show($id)
    {
        $job = Job::with([
            'company.user', 
            'category',
            'applications' => function($q) {
                $q->where('status', 'pending')->count();
            }
        ])->findOrFail($id);

        // Increment views
        $job->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $job
        ]);
    }

    /**
     * Create new job (Company only)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'company') {
            return response()->json([
                'success' => false,
                'message' => 'Only companies can post jobs'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,category_id',
            'job_type' => 'required|in:hourly,daily,project,part-time,full-time,internship',
            'payment_type' => 'required|in:hourly,fixed,monthly',
            'budget_min' => 'nullable|numeric',
            'budget_max' => 'nullable|numeric',
            'hourly_rate' => 'nullable|numeric',
            'duration' => 'nullable|string',
            'hours_per_week' => 'nullable|integer',
            'estimated_hours' => 'nullable|integer',
            'location' => 'required|string',
            'work_mode' => 'required|in:remote,on-site,hybrid',
            'required_skills' => 'nullable|string',
            'experience_level' => 'required|in:entry,intermediate,expert',
            'deadline' => 'nullable|date',
            'is_urgent' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $job = Job::create([
            'company_id' => $user->company->company_id,
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'job_type' => $request->job_type,
            'payment_type' => $request->payment_type,
            'budget_min' => $request->budget_min,
            'budget_max' => $request->budget_max,
            'hourly_rate' => $request->hourly_rate,
            'duration' => $request->duration,
            'hours_per_week' => $request->hours_per_week,
            'estimated_hours' => $request->estimated_hours,
            'location' => $request->location,
            'work_mode' => $request->work_mode,
            'required_skills' => $request->required_skills,
            'experience_level' => $request->experience_level,
            'deadline' => $request->deadline,
            'is_urgent' => $request->is_urgent ?? false,
            'status' => 'pending', // Admin approval required
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully. Waiting for admin approval.',
            'data' => $job->load(['company.user', 'category'])
        ], 201);
    }

    /**
     * Update job (Company owner only)
     */
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'company' || $job->company_id !== $user->company->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'job_type' => 'in:hourly,daily,project,part-time,full-time,internship',
            'location' => 'string',
            'deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $job->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Job updated successfully',
            'data' => $job->load(['company.user', 'category'])
        ]);
    }

    /**
     * Delete job (Company owner only)
     */
    public function destroy(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'company' || $job->company_id !== $user->company->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully'
        ]);
    }

    /**
     * Apply to job (Student only)
     */
    public function apply(Request $request, $id)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['student', 'employee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only students can apply to jobs'
            ], 403);
        }

        $job = Job::findOrFail($id);

        // Check if already applied
        $existing = Application::where('job_id', $job->job_id)
            ->where('student_id', $user->student->student_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied to this job'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'cover_letter' => 'required|string',
            'proposed_rate' => 'nullable|numeric',
            'proposed_duration' => 'nullable|string',
            'portfolio_links' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application = Application::create([
            'job_id' => $job->job_id,
            'student_id' => $user->student->student_id,
            'cover_letter' => $request->cover_letter,
            'proposed_rate' => $request->proposed_rate,
            'proposed_duration' => $request->proposed_duration,
            'portfolio_links' => $request->portfolio_links,
            'status' => 'pending',
        ]);

        // Increment job applications count
        $job->incrementApplications();

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'data' => $application->load('job')
        ], 201);
    }

    /**
     * Get my jobs (Company)
     */
    public function myJobs(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'company') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $jobs = Job::where('company_id', $user->company->company_id)
            ->withCount('applications')
            ->with('category')
            ->latest('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Get my applications (Student)
     */
    public function myApplications(Request $request)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['student', 'employee'])) {
            return response()->json(['success' => false, 'data' => []]);
        }

        $applications = Application::where('student_id', $user->student->student_id)
            ->with(['job.company.user', 'job.category'])
            ->latest('applied_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    /**
     * Get job applications (Company - for specific job)
     */
    public function jobApplications(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'company' || $job->company_id !== $user->company->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $applications = Application::where('job_id', $job->job_id)
            ->with('student.user')
            ->latest('applied_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    /**
     * Update application status (Company)
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $application = Application::findOrFail($applicationId);
        $user = $request->user();

        if ($user->role !== 'company' || $application->job->company_id !== $user->company->company_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,shortlisted,accepted,rejected',
            'company_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application->update([
            'status' => $request->status,
            'company_notes' => $request->company_notes,
        ]);
        $application->markAsReviewed();

        return response()->json([
            'success' => true,
            'message' => 'Application status updated',
            'data' => $application
        ]);
    }

    /**
     * Save/Bookmark job (Student)
     */
    public function saveJob(Request $request, $id)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['student', 'employee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only students can save jobs'
            ], 403);
        }

        $job = Job::findOrFail($id);

        $existing = SavedJob::where('student_id', $user->student->student_id)
            ->where('job_id', $job->job_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Job already saved'
            ], 400);
        }

        SavedJob::create([
            'student_id' => $user->student->student_id,
            'job_id' => $job->job_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job saved successfully'
        ]);
    }

    /**
     * Unsave/Remove bookmarked job (Student)
     */
    public function unsaveJob(Request $request, $id)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['student', 'employee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $savedJob = SavedJob::where('student_id', $user->student->student_id)
            ->where('job_id', $id)
            ->first();

        if (!$savedJob) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found in saved list'
            ], 404);
        }

        $savedJob->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job removed from saved list'
        ]);
    }

    /**
     * Get saved jobs (Student)
     */
    public function savedJobs(Request $request)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['student', 'employee'])) {
            return response()->json(['success' => false, 'data' => []]);
        }

        $savedJobs = SavedJob::where('student_id', $user->student->student_id)
            ->with('job.company.user', 'job.category')
            ->latest('saved_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $savedJobs
        ]);
    }

    /**
     * Get all categories
     * With fallback to hardcoded data if database is empty
     */
    public function categories()
    {
        try {
            // Try to get categories from database
            $categories = Category::orderBy('name')->get();
            
            // If database is empty, return hardcoded categories
            if ($categories->isEmpty()) {
                $categories = collect([
                    [
                        'category_id' => 1,
                        'name' => 'Web Development',
                        'slug' => 'web-development',
                        'description' => 'Full-stack, Frontend, Backend Development',
                        'icon' => '💻'
                    ],
                    [
                        'category_id' => 2,
                        'name' => 'Mobile Development',
                        'slug' => 'mobile-development',
                        'description' => 'Android, iOS, React Native, Flutter',
                        'icon' => '📱'
                    ],
                    [
                        'category_id' => 3,
                        'name' => 'Data Science',
                        'slug' => 'data-science',
                        'description' => 'Machine Learning, AI, Data Analysis',
                        'icon' => '📊'
                    ],
                    [
                        'category_id' => 4,
                        'name' => 'UI/UX Design',
                        'slug' => 'ui-ux-design',
                        'description' => 'User Interface, User Experience Design',
                        'icon' => '🎨'
                    ],
                    [
                        'category_id' => 5,
                        'name' => 'Digital Marketing',
                        'slug' => 'digital-marketing',
                        'description' => 'SEO, SEM, Social Media Marketing',
                        'icon' => '📢'
                    ],
                    [
                        'category_id' => 6,
                        'name' => 'Content Writing',
                        'slug' => 'content-writing',
                        'description' => 'Technical Writing, Copywriting, Blogging',
                        'icon' => '✍️'
                    ],
                    [
                        'category_id' => 7,
                        'name' => 'Business Development',
                        'slug' => 'business-development',
                        'description' => 'Sales, Partnerships, Strategy',
                        'icon' => '💼'
                    ],
                    [
                        'category_id' => 8,
                        'name' => 'DevOps',
                        'slug' => 'devops',
                        'description' => 'Cloud, CI/CD, Infrastructure',
                        'icon' => '⚙️'
                    ],
                    [
                        'category_id' => 9,
                        'name' => 'Cybersecurity',
                        'slug' => 'cybersecurity',
                        'description' => 'Security Analysis, Penetration Testing',
                        'icon' => '🔒'
                    ],
                    [
                        'category_id' => 10,
                        'name' => 'Graphic Design',
                        'slug' => 'graphic-design',
                        'description' => 'Logo, Branding, Illustrations',
                        'icon' => '🖼️'
                    ],
                    [
                        'category_id' => 11,
                        'name' => 'Project Management',
                        'slug' => 'project-management',
                        'description' => 'Agile, Scrum, Product Management',
                        'icon' => '📋'
                    ],
                    [
                        'category_id' => 12,
                        'name' => 'Quality Assurance',
                        'slug' => 'quality-assurance',
                        'description' => 'Manual Testing, Automation, QA',
                        'icon' => '🧪'
                    ]
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
            
        } catch (\Exception $e) {
            // If any error occurs (table doesn't exist, connection issue, etc)
            // Return hardcoded categories as fallback
            $fallbackCategories = [
                [
                    'category_id' => 1,
                    'name' => 'Web Development',
                    'slug' => 'web-development',
                    'description' => 'Full-stack, Frontend, Backend Development',
                    'icon' => '💻'
                ],
                [
                    'category_id' => 2,
                    'name' => 'Mobile Development',
                    'slug' => 'mobile-development',
                    'description' => 'Android, iOS, React Native, Flutter',
                    'icon' => '📱'
                ],
                [
                    'category_id' => 3,
                    'name' => 'Data Science',
                    'slug' => 'data-science',
                    'description' => 'Machine Learning, AI, Data Analysis',
                    'icon' => '📊'
                ],
                [
                    'category_id' => 4,
                    'name' => 'UI/UX Design',
                    'slug' => 'ui-ux-design',
                    'description' => 'User Interface, User Experience Design',
                    'icon' => '🎨'
                ],
                [
                    'category_id' => 5,
                    'name' => 'Digital Marketing',
                    'slug' => 'digital-marketing',
                    'description' => 'SEO, SEM, Social Media Marketing',
                    'icon' => '📢'
                ],
                [
                    'category_id' => 6,
                    'name' => 'Content Writing',
                    'slug' => 'content-writing',
                    'description' => 'Technical Writing, Copywriting, Blogging',
                    'icon' => '✍️'
                ],
                [
                    'category_id' => 7,
                    'name' => 'Business Development',
                    'slug' => 'business-development',
                    'description' => 'Sales, Partnerships, Strategy',
                    'icon' => '💼'
                ],
                [
                    'category_id' => 8,
                    'name' => 'DevOps',
                    'slug' => 'devops',
                    'description' => 'Cloud, CI/CD, Infrastructure',
                    'icon' => '⚙️'
                ],
                [
                    'category_id' => 9,
                    'name' => 'Cybersecurity',
                    'slug' => 'cybersecurity',
                    'description' => 'Security Analysis, Penetration Testing',
                    'icon' => '🔒'
                ],
                [
                    'category_id' => 10,
                    'name' => 'Graphic Design',
                    'slug' => 'graphic-design',
                    'description' => 'Logo, Branding, Illustrations',
                    'icon' => '🖼️'
                ],
                [
                    'category_id' => 11,
                    'name' => 'Project Management',
                    'slug' => 'project-management',
                    'description' => 'Agile, Scrum, Product Management',
                    'icon' => '📋'
                ],
                [
                    'category_id' => 12,
                    'name' => 'Quality Assurance',
                    'slug' => 'quality-assurance',
                    'description' => 'Manual Testing, Automation, QA',
                    'icon' => '🧪'
                ]
            ];
            
            return response()->json([
                'success' => true,
                'data' => $fallbackCategories
            ]);
        }
    }

    /**
     * Get featured jobs
     */
    public function featuredJobs()
    {
        $jobs = Job::where('status', 'active')
            ->where('is_featured', 1)
            ->with(['company.user', 'category'])
            ->latest('created_at')
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Get urgent jobs
     */
    public function urgentJobs()
    {
        $jobs = Job::where('status', 'active')
            ->where('is_urgent', 1)
            ->with(['company.user', 'category'])
            ->latest('created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }
}