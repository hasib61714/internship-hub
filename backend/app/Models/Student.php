<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'university',
        'department',
        'graduation_year',
        'bio',
        'hourly_rate',
        'availability_hours',
        'available_now',
        'total_earnings',
        'completed_jobs',
        'success_rate',
        'response_time',
        'skills',
        'resume',
        'portfolio_url',
        'nid_passport',
        'university_id_card',
        'verification_status',
        'rating',
        'total_reviews',
        'badge',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'available_now' => 'boolean',
        'total_earnings' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'student_id', 'student_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'student_id', 'student_id');
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class, 'student_id', 'student_id');
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class, 'student_id', 'student_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'student_id', 'student_id');
    }

    public function workLogs()
    {
        return $this->hasMany(WorkLog::class, 'student_id', 'student_id');
    }

    // Helper methods
    public function isVerified()
    {
        return $this->verification_status === 'approved';
    }

    public function hasActiveContract()
    {
        return $this->contracts()->where('status', 'active')->exists();
    }
}
