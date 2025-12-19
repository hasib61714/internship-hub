<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Full-stack, Frontend, Backend Development',
                'icon' => '💻',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Mobile Development',
                'slug' => 'mobile-development',
                'description' => 'Android, iOS, React Native, Flutter',
                'icon' => '📱',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Data Science',
                'slug' => 'data-science',
                'description' => 'Machine Learning, AI, Data Analysis',
                'icon' => '📊',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'UI/UX Design',
                'slug' => 'ui-ux-design',
                'description' => 'User Interface, User Experience Design',
                'icon' => '🎨',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Digital Marketing',
                'slug' => 'digital-marketing',
                'description' => 'SEO, SEM, Social Media Marketing',
                'icon' => '📢',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Content Writing',
                'slug' => 'content-writing',
                'description' => 'Technical Writing, Copywriting, Blogging',
                'icon' => '✍️',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Business Development',
                'slug' => 'business-development',
                'description' => 'Sales, Partnerships, Strategy',
                'icon' => '💼',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'DevOps',
                'slug' => 'devops',
                'description' => 'Cloud, CI/CD, Infrastructure',
                'icon' => '⚙️',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Cybersecurity',
                'slug' => 'cybersecurity',
                'description' => 'Security Analysis, Penetration Testing',
                'icon' => '🔒',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Graphic Design',
                'slug' => 'graphic-design',
                'description' => 'Logo, Branding, Illustrations',
                'icon' => '🖼️',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Project Management',
                'slug' => 'project-management',
                'description' => 'Agile, Scrum, Product Management',
                'icon' => '📋',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Quality Assurance',
                'slug' => 'quality-assurance',
                'description' => 'Manual Testing, Automation, QA',
                'icon' => '🧪',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}