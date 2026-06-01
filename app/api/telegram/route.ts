import { NextResponse } from 'next/server';
import { getTasks, addTask, updateTaskStatus, removeTask } from '@/lib/tasks-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.trim();
      
      let replyText = '';
      
      if (text.startsWith('/start') || text.startsWith('/help')) {
        replyText = `Welcome to Shopkiper Task Bot! 🤖

Here are the commands you can use:
/new <task title> - Create a new task (e.g., /new Review marketing budget)
/list - List all active tasks
/update <task_id> <status> - Update task status (e.g., /update task-12345 Completed)
/delete <task_id> - Delete a task`;
      } else if (text.startsWith('/new ')) {
        const title = text.replace('/new ', '').trim();
        const task = {
          id: `task-${Date.now()}`,
          title,
          description: 'Task generated via Telegram',
          status: 'Pending',
          assignedTo: 'ceo',
          createdAt: new Date()
        };
        addTask(task);
        replyText = `✅ Task created successfully!\n\nID: \`${task.id}\`\nTitle: ${task.title}`;
      } else if (text.startsWith('/list')) {
        const tasks = getTasks();
        if (tasks.length === 0) {
          replyText = 'No tasks available.';
        } else {
          replyText = '📋 *Current Tasks:*\n\n' + tasks.map(t => 
            `🆔 \`${t.id}\`\n📝 **${t.title}**\n🔄 Status: ${t.status}\n`
          ).join('\n');
        }
      } else if (text.startsWith('/update ')) {
        const parts = text.split(' ');
        if (parts.length >= 3) {
          const id = parts[1];
          const status = parts.slice(2).join(' ');
          const tasks = getTasks();
          const exists = tasks.find(t => t.id === id);
          
          if (exists) {
            updateTaskStatus(id, status);
            replyText = `🔄 Task \`${id}\` status updated to: ${status}.`;
          } else {
            replyText = `❌ Task \`${id}\` not found.`;
          }
        } else {
          replyText = `Usage: /update <task_id> <status>\nExample: /update task-12345 In Progress`;
        }
      } else if (text.startsWith('/delete ')) {
        const id = text.replace('/delete ', '').trim();
        const tasks = getTasks();
        const exists = tasks.find(t => t.id === id);
        
        if (exists) {
          removeTask(id);
          replyText = `🗑️ Task \`${id}\` deleted successfully.`;
        } else {
          replyText = `❌ Task \`${id}\` not found.`;
        }
      } else {
        replyText = 'Unknown command. Type /help to see available commands.';
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: 'Markdown'
          })
        });
      }
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
