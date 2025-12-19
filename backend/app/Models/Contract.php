<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $primaryKey = 'contract_id';
    public $timestamps = false;

    protected $fillable = [
        'job_id',
        'student_id',
        'company_id',
        'contract_type',
        'rate',
        'total_amount',
        'start_date',
        'end_date',
        'total_hours',
        'hours_worked',
        'status',
        'payment_status',
        'amount_paid',
        'milestones',
        'created_at',
        'completed_at',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'completed_at' => 'datetime',
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

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    public function workLogs()
    {
        return $this->hasMany(WorkLog::class, 'contract_id', 'contract_id');
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class, 'contract_id', 'contract_id');
    }

    // Helper methods
    public function isActive()
    {
        return $this->status === 'active';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function calculateTotalEarnings()
    {
        if ($this->contract_type === 'hourly') {
            return $this->hours_worked * $this->rate;
        }
        return $this->total_amount;
    }
}
