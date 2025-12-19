<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_picture',
        'phone',
        'is_verified',
        'verification_badge',
        'is_active',
        'last_seen',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verification_badge' => 'boolean',
        'is_active' => 'boolean',
        'last_seen' => 'datetime',
        'created_at' => 'datetime',
    ];

    // Relationships
public function student()
{
    return $this->hasOne(Student::class, 'user_id', 'user_id');
}

public function company()
{
    return $this->hasOne(Company::class, 'user_id', 'user_id');
}

public function admin()
{
    return $this->hasOne(Admin::class, 'user_id', 'user_id');
}
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'reviewee_id', 'user_id');
    }

    // Helper methods
    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isCompany()
    {
        return $this->role === 'company';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function getAverageRating()
    {
        return $this->reviews()->avg('overall_rating') ?? 0;
    }
}
