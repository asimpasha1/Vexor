// تخزين مؤقت للمستخدمين (بدلاً من قاعدة البيانات)
interface TempUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  createdAt: string
}

// مصفوفة مؤقتة لتخزين المستخدمين
let tempUsers: TempUser[] = [
  // حساب المدير الافتراضي
  {
    id: "admin-default",
    name: "مدير النظام",
    email: "admin@digitalmarket.com",
    password: "$2b$12$zZbyRVZUh3zZNuYt2ASp5uZFM5IcjisNZk55lNqB5DN0sLL40./nu", // admin123
    role: "ADMIN",
    createdAt: new Date().toISOString()
  },
  // حساب المدير الثاني
  {
    id: "admin-user",
    name: "عاصم حسن",
    email: "admin11@test.com",
    password: "$2b$12$dI9ZV.9ukJlXHMuKMz0NGu1AqiPDsmxXonelGgMl8huxbaDZsYI6W", // admin123
    role: "ADMIN",
    createdAt: new Date().toISOString()
  },
  // حساب مدير إضافي
  {
    id: "admin-main",
    name: "المدير الرئيسي",
    email: "admin@test.com",
    password: "$2b$12$zZbyRVZUh3zZNuYt2ASp5uZFM5IcjisNZk55lNqB5DN0sLL40./nu", // admin123
    role: "ADMIN",
    createdAt: new Date().toISOString()
  },
  // مستخدم تجريبي للاختبار
  {
    id: "test-user-1",
    name: "مستخدم تجريبي",
    email: "test@example.com",
    password: "$2b$12$zZbyRVZUh3zZNuYt2ASp5uZFM5IcjisNZk55lNqB5DN0sLL40./nu", // admin123
    role: "USER",
    createdAt: new Date().toISOString()
  },
  // مستخدم آخر للاختبار
  {
    id: "test-user-2", 
    name: "أحمد محمد",
    email: "ahmed@test.com",
    password: "$2b$12$zZbyRVZUh3zZNuYt2ASp5uZFM5IcjisNZk55lNqB5DN0sLL40./nu", // admin123
    role: "USER",
    createdAt: new Date().toISOString()
  },
  // حساب المستخدم الفعلي
  {
    id: "user-main",
    name: "عاصم حسن", 
    email: "doodooalmahdi@gmail.com",
    password: "$2b$12$zZbyRVZUh3zZNuYt2ASp5uZFM5IcjisNZk55lNqB5DN0sLL40./nu", // admin123
    role: "USER",
    createdAt: new Date().toISOString()
  }
]

export const addTempUser = (user: TempUser) => {
  tempUsers.push(user)
  console.log("=== إضافة مستخدم جديد ===")
  console.log("المستخدم المضاف:", {
    email: user.email,
    name: user.name,
    hasPassword: !!user.password
  })
  console.log("إجمالي المستخدمين:", tempUsers.length)
  console.log("جميع المستخدمين:", tempUsers.map(u => u.email))
}

export const findTempUserByEmail = (email: string): TempUser | undefined => {
  console.log("=== البحث عن مستخدم ===")
  console.log("البحث عن:", email)
  console.log("المستخدمين المتاحين:", tempUsers.map(u => u.email))
  
  const user = tempUsers.find(user => user.email === email)
  console.log("النتيجة:", user ? "تم العثور عليه" : "لم يتم العثور عليه")
  
  if (user) {
    console.log("بيانات المستخدم:", {
      email: user.email,
      name: user.name,
      hasPassword: !!user.password
    })
  }
  
  return user
}

export const updateUserRole = (email: string, newRole: string) => {
  const userIndex = tempUsers.findIndex(user => user.email === email)
  if (userIndex !== -1) {
    tempUsers[userIndex].role = newRole
    console.log(`✅ تم تحديث دور المستخدم ${email} إلى ${newRole}`)
    return true
  }
  console.log(`❌ لم يتم العثور على المستخدم ${email}`)
  return false
}

export const getAllTempUsers = () => {
  return tempUsers
}