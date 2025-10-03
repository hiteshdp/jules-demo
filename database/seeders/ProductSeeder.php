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
                'brand' => 'HairCare Pro',
                'ingredients' => 'Biotin, Keratin, Saw Palmetto, Caffeine, Niacin',
                'usage_instructions' => 'Apply to wet hair, massage gently into scalp, leave for 2-3 minutes, rinse thoroughly. Use 2-3 times per week.',
                'dosage' => '2-3 times per week',
                'restrictions' => 'For external use only. Avoid contact with eyes.',
                'price' => 1299.00,
                'requires_prescription' => false,
                'is_active' => true,
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Hair Growth Serum',
                'description' => 'Concentrated serum with minoxidil and natural extracts to promote hair growth.',
                'category' => 'treatment',
                'brand' => 'HairCare Pro',
                'ingredients' => 'Minoxidil 5%, Peppermint Oil, Rosemary Extract, Biotin',
                'usage_instructions' => 'Apply 1ml to affected areas twice daily. Massage gently into scalp.',
                'dosage' => '1ml twice daily',
                'restrictions' => 'For adults only. Consult doctor if pregnant or breastfeeding.',
                'price' => 2499.00,
                'requires_prescription' => true,
                'is_active' => true,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Biotin Hair Supplements',
                'description' => 'High-potency biotin supplements to support healthy hair growth from within.',
                'category' => 'supplement',
                'brand' => 'HairCare Pro',
                'ingredients' => 'Biotin 10000mcg, Zinc, Iron, Vitamin D3, Folic Acid',
                'usage_instructions' => 'Take 1 capsule daily with water, preferably with a meal.',
                'dosage' => '1 capsule daily',
                'restrictions' => 'Not suitable for children under 12. Consult doctor if taking other medications.',
                'price' => 899.00,
                'requires_prescription' => false,
                'is_active' => true,
                'stock_quantity' => 200,
            ],
            [
                'name' => 'Scalp Massage Oil',
                'description' => 'Nourishing oil blend for scalp massage to improve circulation and hair health.',
                'category' => 'oil',
                'brand' => 'HairCare Pro',
                'ingredients' => 'Coconut Oil, Jojoba Oil, Rosemary Oil, Lavender Oil, Peppermint Oil',
                'usage_instructions' => 'Apply to scalp, massage gently for 5-10 minutes, leave for 30 minutes, then shampoo.',
                'dosage' => '2-3 times per week',
                'restrictions' => 'For external use only. Do a patch test before first use.',
                'price' => 699.00,
                'requires_prescription' => false,
                'is_active' => true,
                'stock_quantity' => 75,
            ],
            [
                'name' => 'Hair Loss Conditioner',
                'description' => 'Moisturizing conditioner with keratin and amino acids to strengthen hair.',
                'category' => 'conditioner',
                'brand' => 'HairCare Pro',
                'ingredients' => 'Keratin, Amino Acids, Argan Oil, Vitamin E, Panthenol',
                'usage_instructions' => 'Apply after shampooing, leave for 2-3 minutes, rinse thoroughly.',
                'dosage' => 'Use with every shampoo',
                'restrictions' => 'For external use only. Avoid contact with eyes.',
                'price' => 1099.00,
                'requires_prescription' => false,
                'is_active' => true,
                'stock_quantity' => 80,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
