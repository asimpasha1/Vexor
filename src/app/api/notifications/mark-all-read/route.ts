import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'notifications.json');

function getStoredNotifications() {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading stored notifications:', error);
  }
  return [];
}

function saveNotifications(notifications: any[]) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving notifications:', error);
    return false;
  }
}

export async function POST() {
  try {
    const notifications = getStoredNotifications();
    
    // تحديد جميع الإشعارات كمقروءة
    const updatedNotifications = notifications.map((notification: any) => ({
      ...notification,
      read: true
    }));
    
    const saved = saveNotifications(updatedNotifications);
    
    if (saved) {
      return NextResponse.json({
        success: true,
        message: 'تم تحديد جميع الإشعارات كمقروءة',
        updatedCount: notifications.filter((n: any) => !n.read).length
      });
    } else {
      throw new Error('Failed to save notifications');
    }

  } catch (error) {
    console.error('Mark all read API error:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الإشعارات' },
      { status: 500 }
    );
  }
}