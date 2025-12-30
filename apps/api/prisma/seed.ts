import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default categories for all users
const defaultCategories = [
  { name: 'Makanan', icon: '🍔', color: '#FF5733' },
  { name: 'Transportasi', icon: '🚗', color: '#3498DB' },
  { name: 'Belanja', icon: '🛒', color: '#2ECC71' },
  { name: 'Tagihan', icon: '💡', color: '#F39C12' },
  { name: 'Kesehatan', icon: '🏥', color: '#E74C3C' },
  { name: 'Hiburan', icon: '🎬', color: '#9B59B6' },
  { name: 'Pendidikan', icon: '📚', color: '#1ABC9C' },
  { name: 'Pakaian', icon: '👕', color: '#E91E63' },
  { name: 'Rumah Tangga', icon: '🏠', color: '#795548' },
  { name: 'Lainnya', icon: '💼', color: '#607D8B' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create default categories (without userId = global categories)
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        isDefault: true,
        userId: null,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          ...category,
          isDefault: true,
          userId: null,
        },
      });
      console.log(`  ✅ Created category: ${category.icon} ${category.name}`);
    } else {
      console.log(`  ⏭️  Category already exists: ${category.icon} ${category.name}`);
    }
  }

  console.log('');
  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
