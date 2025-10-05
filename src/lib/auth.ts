import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { findTempUserByEmail, getAllTempUsers } from "@/lib/temp-users"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=== تسجيل الدخول - بدء العملية ===")
        console.log("البيانات المستلمة:", {
          email: credentials?.email,
          password: credentials?.password ? "موجودة" : "غير موجودة"
        })

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ البيانات ناقصة")
          return null
        }

        // البحث في قاعدة البيانات أولاً
        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            createdAt: true
          }
        })

        // إذا لم يوجد في قاعدة البيانات، ابحث في التخزين المؤقت
        if (!user) {
          const tempUser = findTempUserByEmail(credentials.email)
          if (tempUser) {
            user = {
              id: tempUser.id,
              email: tempUser.email,
              name: tempUser.name,
              role: tempUser.role as any,
              password: tempUser.password,
              createdAt: new Date(tempUser.createdAt)
            }
          }
        }

        if (!user) {
          console.log("❌ لم يتم العثور على المستخدم:", credentials.email)
          const allUsers = getAllTempUsers()
          console.log("المستخدمون المتاحون:", allUsers.map(u => u.email))
          return null
        }

        console.log("✅ تم العثور على المستخدم:", {
          email: user.email,
          name: user.name,
          hasPassword: !!user.password
        })

        // Check password with bcrypt
        if (!user.password) {
          console.log("❌ كلمة المرور غير موجودة للمستخدم")
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          console.log("❌ كلمة المرور غير صحيحة للمستخدم:", credentials.email)
          return null
        }

        console.log("✅ تسجيل الدخول ناجح للمستخدم:", credentials.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: (user as any).role,
          createdAt: (user as any).createdAt,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          createdAt: token.createdAt,
        }
      }
    },
  },
}