import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from 'fs';
import path from 'path';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'notifications.json');

function getStoredNotifications() {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading stored notifications:', error);
  }
  return [];
}

function saveNotifications(notifications: Array<{
  id: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}>) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving notifications:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const notifications = getStoredNotifications();
    
    const updatedNotifications = notifications.map((n: { read: boolean }) => ({
      ...n,
      read: true
    }));

    if (saveNotifications(updatedNotifications)) {
      return NextResponse.json({ 
        success: true,
        message: 'تم تحديد جميع الإشعارات كمقروءة'
      });
    } else {
      return NextResponse.json(
        { error: 'خطأ في حفظ الإشعارات' },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث الإشعارات' },
      { status: 500 }
    );
  }
}