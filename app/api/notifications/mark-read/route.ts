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

export async function POST(request: NextRequest) {
  try {
    const { notificationId } = await request.json();
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'Missing notification ID' },
        { status: 400 }
      );
    }

    const notifications = getStoredNotifications();
    const notificationIndex = notifications.findIndex((n: any) => n.id === notificationId);
    
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // تحديد الإشعار كمقروء
    notifications[notificationIndex].read = true;
    
    const saved = saveNotifications(notifications);
    
    if (saved) {
      return NextResponse.json({
        success: true,
        message: 'تم تحديد الإشعار كمقروء'
      });
    } else {
      throw new Error('Failed to save notifications');
    }

  } catch (error) {
    console.error('Mark read API error:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الإشعار' },
      { status: 500 }
    );
  }
}