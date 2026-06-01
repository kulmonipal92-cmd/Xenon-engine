import { NextResponse } from 'next/server';
import { getTasks, addTask } from '@/lib/tasks-store';

export async function GET() {
  return NextResponse.json(getTasks());
}

export async function POST(req: Request) {
  const task = await req.json();
  addTask({
    ...task,
    createdAt: new Date(task.createdAt)
  });
  return NextResponse.json({ success: true, tasks: getTasks() });
}
