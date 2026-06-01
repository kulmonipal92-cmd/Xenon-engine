export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  createdAt: Date | string;
}

declare global {
  var tasksData: Task[];
}

if (!global.tasksData) {
  global.tasksData = [];
}

export const getTasks = () => global.tasksData;
export const addTask = (task: Task) => global.tasksData.push(task);
export const removeTask = (id: string) => {
  const index = global.tasksData.findIndex(t => t.id === id);
  if (index > -1) {
    global.tasksData.splice(index, 1);
  }
};
export const updateTaskStatus = (id: string, status: string) => {
  const task = global.tasksData.find(t => t.id === id);
  if (task) {
    task.status = status;
  }
};
