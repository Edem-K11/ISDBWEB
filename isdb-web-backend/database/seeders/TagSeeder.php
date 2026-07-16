<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['nom' => 'Éducation', 'slug' => Str::slug('Éducation'), 'couleur' => '#3B82F6'],
            ['nom' => 'Technologie', 'slug' => Str::slug('Technologie'), 'couleur' => '#8B5CF6'],
            ['nom' => 'Science', 'slug' => Str::slug('Science'), 'couleur' => '#10B981'],
            ['nom' => 'Culture', 'slug' => Str::slug('Culture'), 'couleur' => '#F59E0B'],
            ['nom' => 'Business', 'slug' => Str::slug('Business'), 'couleur' => '#EF4444'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}