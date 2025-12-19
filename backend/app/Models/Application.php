<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $primaryKey = 'application_id';
    public $timestamps = false;

    protected $fillable = [
        'job_id',
        'student_id',
        'cover_letter',
        'proposed_rate',
        'proposed_duration',
        'estimated_completion',
        'portfolio_links',
        'sample_work',
        'status',
        'applied_at',
        'reviewed_at',
        'company_notes',
    ];

    protected $casts = [
        'proposed_rate' => 'decimal:2',
        'estimated_completion' => 'date',
        'applied_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    // Relationships
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id', 'job_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isAccepted()
    {
        return $this->status === 'accepted';
    }

    public function markAsReviewed()
    {
        $this->update([
            'reviewed_at' => now(),
        ]);
    }
}
