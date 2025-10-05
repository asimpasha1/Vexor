import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', adminUser)

  // Create sample products
  const products = [
    {
      title: 'Complete React Course 2024',
      description: 'Master React.js from beginner to advanced with real-world projects and modern best practices. Learn hooks, context, Redux, and more.',
      price: 79.99,
      category: 'course',
      featured: true,
      authorId: adminUser.id,
    },
    {
      title: 'Modern UI/UX Design Guide',
      description: 'Learn the principles of modern design with Figma and create stunning user interfaces that convert users into customers.',
      price: 49.99,
      category: 'ebook',
      featured: true,
      authorId: adminUser.id,
    },
    {
      title: 'SaaS Landing Page Template',
      description: 'Professional Next.js template for SaaS companies with conversion-optimized design and modern animations.',
      price: 39.99,
      category: 'template',
      featured: true,
      authorId: adminUser.id,
    },
    {
      title: 'JavaScript Mastery Course',
      description: 'Deep dive into JavaScript ES6+, async programming, and advanced concepts with hands-on projects.',
      price: 69.99,
      category: 'course',
      featured: false,
      authorId: adminUser.id,
    },
    {
      title: 'E-commerce UI Kit',
      description: 'Complete e-commerce design system with 50+ components and screens for mobile and web applications.',
      price: 29.99,
      category: 'template',
      featured: false,
      authorId: adminUser.id,
    },
  ]

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { title: product.title }
    })
    
    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      })
    }
  }

  console.log('Sample products created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })