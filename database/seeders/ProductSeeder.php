<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Gentle Hair Loss Shampoo',
                'description' => 'A gentle, sulfate-free shampoo specifically formulated for hair loss prevention and scalp health.',
                'category' => 'shampoo',
                'price' => 1299.00,
                'is_active' => true,
            ],
            [
                'name' => 'Hair Growth Serum',
                'description' => 'Concentrated serum with minoxidil and natural extracts to promote hair growth.',
                'category' => 'treatment',
                'price' => 2499.00,
                'is_active' => true,
            ],
            [
                'name' => 'Biotin Hair Supplements',
                'description' => 'High-potency biotin supplements to support healthy hair growth from within.',
                'category' => 'supplement',
                'price' => 899.00,
                'is_active' => true,
            ],
            [
                'name' => 'Scalp Massage Oil',
                'description' => 'Nourishing oil blend for scalp massage to improve circulation and hair health.',
                'category' => 'oil',
                'price' => 699.00,
                'is_active' => true,
            ],
            [
                'name' => 'Hair Loss Conditioner',
                'description' => 'Moisturizing conditioner with keratin and amino acids to strengthen hair.',
                'category' => 'conditioner',
                'price' => 1099.00,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
