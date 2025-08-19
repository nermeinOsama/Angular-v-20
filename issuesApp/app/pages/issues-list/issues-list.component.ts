import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IssuesService } from 'app/core/services/issues.service';
import { IssueStatusEnum } from 'app/core/enum/IssueStatusEnum';
import { globalLoading } from 'app/core/interceptors/loading.interceptor';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit, OnDestroy {
  private issuesService = inject(IssuesService);

  // Use signals from the service directly
  issues = this.issuesService.issues;
  loading = this.issuesService.loading;
  error = this.issuesService.error;
  
// use globalLoading as Interceptor 
  globalLoading= globalLoading;
  searchTerm = signal<string>('');
  statusFilter = signal<IssueStatusEnum | ''>('');

  // Computed signal for filtered issues
  filteredIssues = computed(() => {
    let filtered = [...this.issues()];
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    if (search) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(search) ||
        issue.description.toLowerCase().includes(search)
      );
    }
    if (status) {
      filtered = filtered.filter(issue => issue.status === status);
    }
    return filtered;
  });

  ngOnInit(): void {
    this.issuesService.getIssues().subscribe();
  }

  ngOnDestroy(): void {}

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  

  clearSearch(): void {
    this.searchTerm.set('');
  }

  retryLoad(): void {
    this.issuesService.clearError();
    this.issuesService.getIssues().subscribe();
  }

  getShortDescription(description: string): string {
    return description.length > 120
      ? description.substring(0, 120) + '...'
      : description;
  }

  getStatusLabel(status: IssueStatusEnum): string {
    const labels: Record<IssueStatusEnum, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };
    return labels[status];
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return priority;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getEmptyMessage(): string {
    if (this.searchTerm() || this.statusFilter()) {
      return 'No issues match your current filters. Try adjusting your search criteria.';
    }
    return 'Get started by creating your first issue to track work and progress.';
  }
}
