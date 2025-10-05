"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { 
  ArrowRight, 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  TrendingUp,
  Globe,
  Heart,
  Star,
  CheckCircle,
  Calendar,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Eye,
  Zap,
  Facebook,
  Github
} from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/hooks/useSettings"
import { useRef } from "react"

interface AboutSettings {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
  valuesTitle: string
  values: Array<{
    title: string
    description: string
  }>
  teamTitle: string
  teamDescription: string
  team?: TeamMember[]
  contactTitle: string
  contactDescription: string
  phone: string
  email: string
  address: string
  socialLinks: {
    twitter: string
    linkedin: string
    instagram: string
    facebook?: string
  }
}

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image?: string
  social: {
    linkedin?: string
    twitter?: string
    github?: string
    email?: string
  }
}

interface Milestone {
  year: string
  title: string
  description: string
  achievement?: string
}

export default function AboutPage() {
  const { siteName, loading: settingsLoading } = useSettings()
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'values'>('vision')
  const ref = useRef(null)

  useEffect(() => {
    fetchAboutSettings()
  }, [])

  const fetchAboutSettings = async () => {
    try {
      const response = await fetch('/api/settings/about')
      const result = await response.json()
      
      if (result.success) {
        console.log('About settings loaded:', result.data)
        console.log('Team data:', result.data.team)
        setAboutSettings(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch about settings:', error)
    } finally {
      setLoading(false)
    }
  }
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const stats = [
    { number: "50K+", label: "عملاء سعداء", icon: Users },
    { number: "1000+", label: "منتج رقمي", icon: Award },
    { number: "98%", label: "معدل الرضا", icon: Star },
    { number: "24/7", label: "دعم فني", icon: Heart }
  ]

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "أحمد محمد",
      role: "المؤسس والرئيس التنفيذي",
      bio: "خبير في التكنولوجيا المالية مع أكثر من 10 سنوات من الخبرة في تطوير المنصات الرقمية",
      image: "/uploads/team/placeholder-ceo.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ahmed@djitalmarket.com"
      }
    },
    {
      id: 2, 
      name: "سارة أحمد",
      role: "مديرة التطوير التقني",
      bio: "مهندسة برمجيات متخصصة في تطوير تطبيقات الويب الحديثة وحلول الذكاء الاصطناعي",
      image: "/uploads/team/placeholder-cto.jpg", 
      social: {
        linkedin: "#",
        github: "#",
        email: "sara@djitalmarket.com"
      }
    },
    {
      id: 3,
      name: "محمد علي", 
      role: "مدير التسويق الرقمي",
      bio: "خبير في استراتيجيات التسويق الرقمي والنمو، متخصص في بناء العلامات التجارية القوية",
      image: "/uploads/team/placeholder-cmo.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mohamed@djitalmarket.com"
      }
    },
    {
      id: 4,
      name: "فاطمة حسن",
      role: "مديرة تجربة العملاء", 
      bio: "متخصصة في تحسين تجربة المستخدم وضمان رضا العملاء من خلال الحلول المبتكرة",
      image: "/images/team/cx.jpg",
      social: {
        linkedin: "#",
        email: "fatima@djitalmarket.com"
      }
    }
  ]

  const milestones: Milestone[] = [
    {
      year: "2020",
      title: "البداية الرقمية",
      description: "تأسيس المنصة برؤية واضحة لتقديم حلول رقمية مبتكرة",
      achievement: "إطلاق أول 50 منتج رقمي"
    },
    {
      year: "2021", 
      title: "التوسع والنمو",
      description: "توسيع قاعدة العملاء وإضافة شراكات استراتيجية جديدة",
      achievement: "وصول 10,000 عميل وأكثر من 500 منتج"
    },
    {
      year: "2022",
      title: "الريادة التقنية", 
      description: "تطوير تقنيات الذكاء الاصطناعي وحلول التعلم الآلي",
      achievement: "جائزة أفضل منصة رقمية في المنطقة"
    },
    {
      year: "2023",
      title: "الابتكار المستمر",
      description: "إطلاق ميزات جديدة وتحسين تجربة المستخدم",
      achievement: "تجاوز 25,000 عميل و 750 منتج"
    },
    {
      year: "2024",
      title: "القيادة السوقية",
      description: "ترسيخ مكانتنا كمنصة رائدة في السوق العربي",
      achievement: "50,000+ عميل و 1000+ منتج رقمي"
    }
  ]

  const partners = [
    { name: "Microsoft", logo: "/images/partners/microsoft.svg" },
    { name: "Google", logo: "/images/partners/google.svg" },
    { name: "AWS", logo: "/images/partners/aws.svg" },
    { name: "Adobe", logo: "/images/partners/adobe.svg" },
    { name: "Figma", logo: "/images/partners/figma.svg" },
    { name: "GitHub", logo: "/images/partners/github.svg" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-tight relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {aboutSettings?.heroTitle || "من نحن"}
                </span>
              </span>
              <span className="block text-2xl md:text-4xl text-gray-700 dark:text-gray-300 font-medium">
                {aboutSettings?.heroSubtitle || "قصة نجاح في عالم التكنولوجيا"}
              </span>
              
              {/* Glowing effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-xl opacity-50"></div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto"
            >
              {aboutSettings?.heroDescription || "مرحباً بك في عالم الإبداع الرقمي! نحن مجموعة من المبدعين والمطورين الذين يؤمنون بقوة التكنولوجيا في تحويل الأفكار إلى واقع ملموس."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="#our-story">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    اكتشف قصتنا
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>

              <Link href="#team">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group overflow-hidden hover:border-purple-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">تعرف على الفريق</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        
        <div className="w-full relative">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg group-hover:shadow-xl"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision, Mission, Values Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                رؤيتنا ورسالتنا
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              نؤمن بقوة التكنولوجيا في تغيير العالم وتحسين حياة الناس
            </p>
          </motion.div>

          <div className="mb-12">
            <div className="flex justify-center space-x-1 space-x-reverse mb-8">
              {[
                { key: 'vision' as const, label: 'رؤيتنا', icon: Target },
                { key: 'mission' as const, label: 'رسالتنا', icon: Lightbulb },
                { key: 'values' as const, label: 'قيمنا', icon: Heart }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              {activeTab === 'vision' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {aboutSettings?.visionTitle || "رؤيتنا"}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {aboutSettings?.visionDescription || "أن نكون المنصة الرائدة عالمياً في تقديم الحلول الرقمية المبتكرة، ونساهم في بناء مستقبل تقني متطور يخدم الإنسانية ويحقق التنمية المستدامة."}
                  </p>
                </div>
              )}

              {activeTab === 'mission' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {aboutSettings?.missionTitle || "رسالتنا"}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {aboutSettings?.missionDescription || "نسعى لتمكين الأفراد والشركات من خلال توفير منتجات رقمية عالية الجودة وحلول تقنية مبتكرة، مع التركيز على تجربة مستخدم استثنائية ودعم مستمر."}
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full mb-6">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">قيمنا</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {(aboutSettings?.values || [
                      { title: 'الابتكار', description: 'نسعى دائماً للإبداع والتطوير' },
                      { title: 'الجودة', description: 'نلتزم بأعلى معايير الجودة' },
                      { title: 'الشفافية', description: 'نؤمن بالصدق والوضوح مع عملائنا' },
                      { title: 'العمل الجماعي', description: 'قوتنا في تضافر جهود الفريق' },
                      { title: 'رضا العملاء', description: 'عملاؤنا هم محور اهتمامنا' },
                      { title: 'التطوير المستمر', description: 'نتعلم ونطور أنفسنا باستمرار' }
                    ]).map((value, index) => (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="our-story" className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                قصة نجاحنا
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              رحلة من الحلم إلى الواقع، مليئة بالإنجازات والتطور المستمر
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {milestone.description}
                      </p>
                      {milestone.achievement && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">{milestone.achievement}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Timeline node */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="relative z-10 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg"
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  </motion.div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {aboutSettings?.teamTitle || "فريق العمل"}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {aboutSettings?.teamDescription || "مجموعة من الخبراء والمتخصصين الذين يعملون بشغف لتحقيق رؤيتنا"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutSettings?.team || teamMembers).map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="relative">
                    <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onError={(e) => {
                            console.log('Image failed to load:', member.image);
                            e.currentTarget.style.display = 'none';
                            const fallbackDiv = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                            if (fallbackDiv) {
                              fallbackDiv.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      {/* Fallback icon */}
                      <div className={`fallback-icon absolute inset-0 flex items-center justify-center ${member.image ? 'hidden' : 'flex'}`}>
                        <Users className="h-24 w-24 text-blue-500/50" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    
                    <div className="flex space-x-3 space-x-reverse">
                      {member.social.linkedin && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={member.social.linkedin}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </motion.a>
                      )}
                      {member.social.twitter && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={member.social.twitter}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </motion.a>
                      )}
                      {member.social.github && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={member.social.github}
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </motion.a>
                      )}
                      {member.social.email && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={`mailto:${member.social.email}`}
                          className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                شركاؤنا في النجاح
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              نفخر بشراكاتنا مع أكبر الشركات التقنية العالمية
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center h-24 group-hover:shadow-xl transition-all duration-300">
                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-lg font-semibold">
                    {partner.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.1),transparent)]"></div>
        
        <div className="w-full max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold relative">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ابدأ رحلتك معنا
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              انضم إلى آلاف العملاء الذين اختاروا منصتنا لتحقيق أهدافهم الرقمية. ابدأ اليوم واكتشف الفرق.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">تصفح منتجاتنا</span>
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group overflow-hidden hover:border-purple-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">تواصل معنا</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      {aboutSettings && (aboutSettings.phone || aboutSettings.email || aboutSettings.address) && (
        <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          
          <div className="w-full relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {aboutSettings.contactTitle || "تواصل معنا"}
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {aboutSettings.contactDescription || "نحن هنا لمساعدتك في تحقيق أهدافك الرقمية"}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {aboutSettings.phone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">الهاتف</h3>
                  <p className="text-gray-600 dark:text-gray-300">{aboutSettings.phone}</p>
                </motion.div>
              )}

              {aboutSettings.email && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">البريد الإلكتروني</h3>
                  <p className="text-gray-600 dark:text-gray-300">{aboutSettings.email}</p>
                </motion.div>
              )}

              {aboutSettings.address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">العنوان</h3>
                  <p className="text-gray-600 dark:text-gray-300">{aboutSettings.address}</p>
                </motion.div>
              )}
            </div>

            {/* Social Links */}
            {aboutSettings.socialLinks && Object.keys(aboutSettings.socialLinks).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">تابعنا على</h3>
                <div className="flex justify-center gap-4">
                  {aboutSettings.socialLinks.facebook && (
                    <a
                      href={aboutSettings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                  {aboutSettings.socialLinks.twitter && (
                    <a
                      href={aboutSettings.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors duration-300"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                  {aboutSettings.socialLinks.instagram && (
                    <a
                      href={aboutSettings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {aboutSettings.socialLinks.linkedin && (
                    <a
                      href={aboutSettings.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors duration-300"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}