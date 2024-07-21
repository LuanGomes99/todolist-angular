import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  public tasks: Task[] = [];
  public newTask: string = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    const url = "http://localhost:3000/tasks";
    this.getTasks(url).subscribe(data => {
      this.tasks = data;
    });
  }

  getTasks(url: string): Observable<Task[]> {
    return this.httpClient.get<Task[]>(url);
  }

  public save(): void {
    const url = "http://localhost:3000/tasks";
    const newTask: Task = {
      id: this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1,
      title: this.newTask,
      done: false
    };
    this.httpClient.post<Task>(url, newTask).subscribe((task) => {
      this.tasks.push(task);
      this.newTask = '';
    });
  }

  public deleteTask(id: number): void {
    const url = `http://localhost:3000/tasks/${id}`;
    console.log(`Deletando tarefa com id: ${id}`); // Log para verificar se o método é chamado
    this.httpClient.delete(url).subscribe({
      next: () => {
        console.log('Tarefa deletada com sucesso'); // Log de sucesso
        this.tasks = this.tasks.filter(task => task.id !== id); // Atualiza o estado local
      },
      error: (error) => {
        console.error('Erro ao deletar a tarefa:', error); // Log de erro
      }
    });
  }

  public toggleTask(task: Task): void {
    task.done = !task.done;
    const url = `http://localhost:3000/tasks/${task.id}`
    this.httpClient.patch(url, { done: task.done }).subscribe()
  }
}
