import { MutationTree } from 'vuex';
import { defaultState, TaskMap, TaskState } from '@/store/tasks/state';
import { Task, TaskMeta } from '@/types/task';

const unlockTask = (state: TaskState, taskId: number) => {
  const locked = [...state.locked];
  const idIndex = locked.findIndex(value => value === taskId);
  locked.splice(idIndex, 1);
  return locked;
};

export const mutations: MutationTree<TaskState> = {
  add: (state: TaskState, task: Task<TaskMeta>) => {
    const update: TaskMap<TaskMeta> = {};
    update[task.id] = task;
    state.tasks = { ...state.tasks, ...update };
  },
  lock: (state: TaskState, taskId: number) => {
    state.locked = [...state.locked, taskId];
  },
  unlock: (state: TaskState, taskId: number) => {
    state.locked = unlockTask(state, taskId);
  },
  remove: (state: TaskState, taskId: number) => {
    const tasks = { ...state.tasks };
    delete tasks[taskId];
    state.tasks = tasks;
    state.locked = unlockTask(state, taskId);
  },
  reset: (state: TaskState) => {
    Object.assign(state, defaultState());
  }
};
