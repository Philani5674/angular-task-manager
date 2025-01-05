import { Component, effect, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService, Task } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';
import { TaskComponent } from "../task/task.component";
import { CommonModule } from '@angular/common';
import { RubiksCubeComponent } from "../rubiks-cube/rubiks-cube.component";


@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [FormsModule, TaskComponent, CommonModule, RubiksCubeComponent],
  templateUrl: "./task-board.component.html",
  styleUrls: ["./task-board.component.css"],
})
export class TaskBoardComponent implements OnInit {
  user: User | null = null;
  tasks = signal<Task[]>([]);
  statuses = signal<{title:string, opened: boolean}[]>([{title:'backlog',opened: true},{title:'in-progress',opened: true},{title:'in-production',opened: true},{title:'completed',opened: true}]);
  showModal = false;
  editingTask: any = null;
  currentTask: Task = this.getEmptyTask();

  constructor(private supabase: SupabaseService) {

    effect(() => {
      console.log(this.statuses());
    });
  }

  ngOnInit() {
    this.supabase.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadTasks();
      }
    });
  }

  async signIn() {
    await this.supabase.signInWithGoogle();
  }

  async signOut() {
    await this.supabase.signOut();
    this.tasks.set([])
  }

  async loadTasks() {
    try {
      this.tasks.set(await this.supabase.getTasks());
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    console.log(this.user?.user_metadata['full_name']);
  }

  getTasksByStatus(status: string) {
    return this.tasks().filter(task => task.status === status);
  }

  getEmptyTask() {
    return {
      title: '',
      description: '',
      status: 'backlog',
      user_id: this.user?.id,
    };
  }

  showNewTaskModal() {
    this.editingTask = null;
    this.currentTask = this.getEmptyTask();
    this.showModal = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.currentTask = { ...task };
    this.showModal = true;
  }

  async saveTask() {
    console.log('Saving task:', this.currentTask);
    try {
      if (this.editingTask) {
        await this.supabase.updateTask(this.editingTask.id, this.currentTask);
      } else {
        await this.supabase.createTask(this.currentTask);
      }
      await this.loadTasks();
      this.closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  async updateTaskStatus(task: Task) {
    try {
      await this.supabase.updateTask(task.id as string, { status: task.status });
      await this.loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  async deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await this.supabase.deleteTask(id);
        await this.loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingTask = null;
    this.currentTask = this.getEmptyTask();
  }

  toggleStatus(title: string) {
    this.statuses.update(statuses =>  statuses.map(s => s.title === title ? {...s, opened: !s.opened} : s));
  }
  
}