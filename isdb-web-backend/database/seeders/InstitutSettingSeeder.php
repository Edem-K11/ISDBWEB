<?php

namespace Database\Seeders;

use App\Models\InstitutSetting;
use Illuminate\Database\Seeder;

class InstitutSettingSeeder extends Seeder
{
    public function run(): void
    {
        InstitutSetting::firstOrCreate([], InstitutSetting::defaults());
    }
}
