import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة البيانات الواقعية...')

  // مسح البيانات الحالية أولاً
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('🗑️  تم مسح البيانات القديمة')

  // إنشاء مستخدم admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@digitalmarket.com',
      name: 'مدير النظام',
      role: 'ADMIN'
    }
  })
  console.log('👤 تم إنشاء مستخدم المدير')

  const realisticProducts = [
    {
      title: "دورة React المتقدمة 2024",
      description: "تعلم React.js من المستوى المتقدم مع أحدث التقنيات والممارسات. تشمل Next.js، TypeScript، وإدارة الحالة المتقدمة.",
      price: 299.99,
      category: "course",
      featured: true,
      image: "/images/react-course.jpg",
      authorId: adminUser.id
    },
    {
      title: "كتاب تطوير المواقع الحديثة",
      description: "دليل شامل لتطوير المواقع باستخدام أحدث التقنيات. يغطي HTML5، CSS3، JavaScript، وأطر العمل الحديثة.",
      price: 49.99,
      category: "ebook", 
      featured: true,
      image: "/images/web-dev-book.jpg",
      authorId: adminUser.id
    },
    {
      title: "قالب موقع شركة تقنية",
      description: "قالب احترافي لمواقع الشركات التقنية مصمم بـ Next.js و TailwindCSS. يشمل صفحات متعددة وتصميم متجاوب.",
      price: 89.99,
      category: "template",
      featured: false,
      image: "/images/tech-template.jpg",
      authorId: adminUser.id
    },
    {
      title: "أداة إدارة المشاريع",
      description: "تطبيق ويب متكامل لإدارة المشاريع والفرق. يشمل لوحة تحكم، إدارة المهام، والتقارير.",
      price: 199.99,
      category: "software",
      featured: true,
      image: "/images/project-tool.jpg",
      authorId: adminUser.id
    },
    {
      title: "دورة UI/UX Design",
      description: "تعلم أساسيات ومتقدمات تصميم واجهات المستخدم وتجربة المستخدم باستخدام Figma وأدوات التصميم الحديثة.",
      price: 179.99,
      category: "course",
      featured: false,
      image: "/images/uiux-course.jpg",
      authorId: adminUser.id
    },
    {
      title: "مجموعة أيقونات SVG",
      description: "مجموعة من 500+ أيقونة SVG عالية الجودة للاستخدام في المشاريع التجارية. تشمل فئات متنوعة.",
      price: 29.99,
      category: "template",
      featured: false,
      image: "/images/svg-icons.jpg",
      authorId: adminUser.id
    },
    {
      title: "كتاب الذكاء الاصطناعي للمطورين",
      description: "دليل عملي لتطبيق الذكاء الاصطناعي في التطوير. يغطي Machine Learning، APIs، والتطبيق العملي.",
      price: 79.99,
      category: "ebook",
      featured: true,
      image: "/images/ai-book.jpg",
      authorId: adminUser.id
    },
    {
      title: "نظام إدارة المحتوى",
      description: "نظام CMS مبني بـ Next.js يمكن تخصيصه لأي نوع من المواقع. يشمل لوحة إدارة ونظام صلاحيات.",
      price: 349.99,
      category: "software",
      featured: false,
      image: "/images/cms-system.jpg",
      authorId: adminUser.id
    },
    {
      title: "دورة التجارة الإلكترونية",
      description: "تعلم بناء متجر إلكتروني متكامل من الصفر باستخدام أحدث التقنيات وأنظمة الدفع.",
      price: 259.99,
      category: "course",
      featured: true,
      image: "/images/ecommerce-course.jpg",
      authorId: adminUser.id
    },
    {
      title: "قالب لوحة تحكم إدارية",
      description: "لوحة تحكم احترافية مع مكونات جاهزة وتصميم حديث. مناسبة للتطبيقات الإدارية والتجارية.",
      price: 129.99,
      category: "template",
      featured: false,
      image: "/images/admin-dashboard.jpg",
      authorId: adminUser.id
    }
  ]

  // إضافة المنتجات الواقعية
  for (const product of realisticProducts) {
    const createdProduct = await prisma.product.create({
      data: product
    })
    console.log(`✅ تم إضافة المنتج: ${createdProduct.title}`)
  }

  console.log('\n📊 إحصائيات البيانات الجديدة:')
  
  const totalProducts = await prisma.product.count()
  const featuredProducts = await prisma.product.count({ where: { featured: true } })
  const categoryCounts = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  })

  console.log(`- إجمالي المنتجات: ${totalProducts}`)
  console.log(`- المنتجات المميزة: ${featuredProducts}`)
  console.log('\n📈 توزيع الفئات:')
  
  for (const cat of categoryCounts) {
    const categoryNames = {
      course: 'كورسات',
      ebook: 'كتب إلكترونية', 
      template: 'قوالب',
      software: 'برامج'
    }
    console.log(`- ${categoryNames[cat.category as keyof typeof categoryNames] || cat.category}: ${cat._count} منتج`)
  }

  console.log('\n🎉 تم إضافة البيانات الواقعية بنجاح!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🏁 انتهى السكريبت بنجاح')
  })