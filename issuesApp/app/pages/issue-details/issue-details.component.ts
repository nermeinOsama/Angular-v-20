import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IssuesService } from 'app/core/services/issues.service';
import { Issue } from 'app/core/models/issue.model';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,MatChipsModule
  ],
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.scss']
})
export class IssueDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private issuesService = inject(IssuesService);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  issue = signal<Issue | null>(null);
  message = signal<string | null>(null);
  issueId: number | string | null = null;
  
  ngOnInit(): void {
  this.route.params.subscribe(params => {
    const id = params['id'];
    if (id != null) {
     this.issueId = id;
      if (this.issueId !== null) {
        this.loadIssue(this.issueId);
      }
    }
  });
}

  private loadIssue(id:  number | string): void {
    this.loading.set(true);
    this.error.set(null);
    this.issuesService.getIssueById(id).subscribe(issue => {
      this.loading.set(false);
      if (issue) {
        this.issue.set(issue);
      } else {
        this.error.set('Issue not found');
      }
    });
  }

  retryLoad(): void {
    if (this.issueId) {
      this.error.set(null);
      this.loadIssue(this.issueId);
    }
  }

  goBack(): void {
    this.router.navigate(['/issues']);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };
    return labels[status] || status;
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

  confirmDelete(): void {
    const issue = this.issue();
    if (!issue) return;

    const confirmed = confirm(`Are you sure you want to delete "${issue.title}"? This action cannot be undone.`);
    if (confirmed) {
      this.loading.set(true);
      this.issuesService.deleteIssue(issue.id)
        .subscribe(success => {
          this.loading.set(false);
          if (success) {
            this.message.set('Issue deleted successfully');
            this.router.navigate(['/issues']);
          } else {
            this.message.set('Failed to delete issue');
          }
        });
    }
  }
}

