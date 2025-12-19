<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $primaryKey = 'job_id';
    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'category_id',
        'job_type',
        'payment_type',
        'budget_min',
        'budget_max',
        'hourly_rate',
        'duration',
        'hours_per_week',
        'estimated_hours',
        'location',
        'work_mode',
        'required_skills',
        'experience_level',
        'status',
        'is_urgent',
        'is_featured',
        'deadline',
        'published_at',
        'total_applications',
        'total_views',
    ];

    protected $casts = [
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'is_urgent' => 'boolean',
        'is_featured' => 'boolean',
        'deadline' => 'date',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id', 'job_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'job_id', 'job_id');
    }

    public function savedBy()
    {
        return $this->hasMany(SavedJob::class, 'job_id', 'job_id');
    }

    // Helper methods
    public function isActive()
    {
        return $this->status === 'active';
    }

    public function incrementViews()
    {
        $this->increment('total_views');
    }

    public function incrementApplications()
    {
        $this->increment('total_applications');
    }
}
