import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/issues',
    pathMatch: 'full'
  },
  {
    path: 'issues',
    loadComponent: () => import('./pages/issues-list/issues-list.component').then(c => c.IssuesListComponent)
  },
  {
    path: 'issues/new',
    loadComponent: () => import('./pages/issue-form/issue-form.component').then(c => c.IssueFormComponent)
  },
  {
    path: 'issues/:id',
    loadComponent: () => import('./pages/issue-details/issue-details.component').then(c => c.IssueDetailsComponent)
  },
  {
    path: 'issues/:id/edit',
    loadComponent: () => import('./pages/issue-form/issue-form.component').then(c => c.IssueFormComponent)
  },
  {
    path: '**',
    redirectTo: '/issues'
  }
];
