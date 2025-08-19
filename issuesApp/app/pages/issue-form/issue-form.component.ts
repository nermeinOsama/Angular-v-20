import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { IssuesService } from 'app/core/services/issues.service';
import { Issue, CreateIssueRequest } from 'app/core/models/issue.model';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private issuesService = inject(IssuesService);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);

  issueForm: FormGroup;
  private issueId: number | string | null = null;

  constructor() {
    this.issueForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(1000)
      ]],
      status: ['todo', [Validators.required]],
      priority: ['medium', [Validators.required]],
      assignee: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });
  }

  private checkEditMode(): void {
   this.route.params.subscribe(params => {
    const id = params['id'];
   
    if (id != null && id !== 'new') {
       this.issueId = id;
      this.isEditMode.set(true);
      
      if (this.issueId !== null) {
        this.loadIssue(this.issueId);
      }
    } else {
      this.isEditMode.set(false);
      this.issueId = null;
    }
  });
  }

  private loadIssue(id: number | string): void {
    this.loading.set(true);
    this.error.set(null);
    this.issuesService.getIssueById(id).subscribe(issue => {
      this.loading.set(false);
      if (issue) {
        this.populateForm(issue);
      } else {
        this.error.set('Issue not found');
      }
    });
  }

  private populateForm(issue: Issue): void {
    this.issueForm.patchValue({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assignee: issue.assignee
    });
  }

  onSubmit(): void {
    if (this.issueForm.invalid || this.submitting()) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    const formValue = this.issueForm.value as CreateIssueRequest;

    const operation = this.isEditMode() && this.issueId
      ? this.issuesService.updateIssue(this.issueId, formValue)
      : this.issuesService.createIssue(formValue);

    operation.subscribe(result => {
      this.submitting.set(false);
      if (result) {
        const message = this.isEditMode() 
          ? 'Issue updated successfully' 
          : 'Issue created successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        
        if (this.isEditMode()) {
          this.router.navigate(['/issues', this.issueId]);
        } else {
          this.router.navigate(['/issues']);
        }
      } else {
        this.error.set('Failed to save issue. Please try again.');
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.issueForm.controls).forEach(key => {
      const control = this.issueForm.get(key);
      control?.markAsTouched();
    });
  }

  retryLoad(): void {
    if (this.isEditMode() && this.issueId) {
      this.error.set(null);
      this.loadIssue(this.issueId);
    }
  }

  goBack(): void {
    if (this.isEditMode() && this.issueId) {
      this.router.navigate(['/issues', this.issueId]);
    } else {
      this.router.navigate(['/issues']);
    }
  }

  // Accessibility helper methods
  getTitleErrorId(): string {
    return 'title-error';
  }

  getDescriptionErrorId(): string {
    return 'description-error';
  }

  getStatusErrorId(): string {
    return 'status-error';
  }

  getPriorityErrorId(): string {
    return 'priority-error';
  }

  getAssigneeErrorId(): string {
    return 'assignee-error';
  }
}

