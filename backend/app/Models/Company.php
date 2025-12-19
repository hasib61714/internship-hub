<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $primaryKey = 'company_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'company_name',
        'company_size',
        'industry',
        'company_location',
        'company_address',
        'company_website',
        'company_logo',
        'company_description',
        'trade_license',
        'tax_certificate',
        'verification_status',
        'total_jobs_posted',
        'total_hires',
        'rating',
        'total_reviews',
        'is_featured',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function jobs()
    {
        return $this->hasMany(Job::class, 'company_id', 'company_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'company_id', 'company_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'company_id', 'company_id');
    }

    // Helper methods
    public function isVerified()
    {
        return $this->verification_status === 'approved';
    }

    public function activeJobs()
    {
        return $this->jobs()->where('status', 'active');
    }

    public function activeContracts()
    {
        return $this->contracts()->where('status', 'active');
    }
}
