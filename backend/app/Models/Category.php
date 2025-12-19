<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $timestamps = false;
    
    protected $table = 'categories';
    protected $primaryKey = 'category_id';
    
    protected $fillable = [
        'category_name',
        'description',
        'icon',
        'is_active'
    ];
    
    // Relationships
    public function jobs()
    {
        return $this->hasMany(Job::class, 'category_id', 'category_id');
    }
}