import { Component, input, output } from '@angular/core';
import { SupabaseService, Task } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '@supabase/supabase-js';


@Component({
  selector: 'app-task', 
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
 
})
export class TaskComponent {
  task = input.required<Task>();
  edit = output<Task>();
  loadTask = output();
  statuses = ['backlog', 'in-progress', 'in-production', 'completed'];
  editTask = output<Task>();
  user = input.required<User>();
  isEditing = false;

  constructor(private supabase: SupabaseService) {}

  onEdit() {
    this.edit.emit(this.task());
  }

  async deleteTask() {
    try {
      await this.supabase.deleteTask(this.task().id as string);
      this.loadTask.emit();
    } catch (error) {
      console.error('Error deleting task:', error);
    }

  }

  async updateTaskStatus() {
    try {
      await this.supabase.updateTask(this.task().id as string, { status: this.task().status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  toggleEditing() {
    if (this.isEditing) {
      this.supabase.updateTask(this.task().id as string, { title: this.task().title, description: this.task().description });
    }
    this.isEditing = !this.isEditing;
  }
}