<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';
    protected $primaryKey = 'admin_id';
    
    public $timestamps = true;
    
    protected $fillable = [
        'user_id',
        'department',
        'permissions'
    ];

    protected $casts = [
        'permissions' => 'array'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}