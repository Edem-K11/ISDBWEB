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
            ['nom' => 'Éducation', 'slug' => Str::slug('Éducation')],
            ['nom' => 'Technologie', 'slug' => Str::slug('Technologie')],
            ['nom' => 'Science', 'slug' => Str::slug('Science')],
            ['nom' => 'Culture', 'slug' => Str::slug('Culture')],
            ['nom' => 'Business', 'slug' => Str::slug('Business')],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}