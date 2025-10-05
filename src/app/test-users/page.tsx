"use client"

import { useState, useEffect } from "react"

export default function TestUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">المستخدمين المسجلين</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="mb-4">عدد المستخدمين: {users.length}</p>
        {users.map((user: any, index) => (
          <div key={index} className="mb-2 p-2 bg-white rounded">
            <p><strong>الاسم:</strong> {user.name}</p>
            <p><strong>البريد:</strong> {user.email}</p>
            <p><strong>الدور:</strong> {user.role}</p>
            <p><strong>كلمة المرور مشفرة:</strong> {user.password ? "نعم" : "لا"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}