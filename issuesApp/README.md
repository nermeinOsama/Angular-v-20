# Catalyst Frontend Assessment - Mini Issue Tracker

## Project Overview

This is a Mini Issue Tracker Angular application built as part of the Catalyst Frontend Assessment. The application demonstrates clean architecture, TypeScript usage, accessible UI, and proper state management.

## Features Implemented

### Must-Have Features ✅
1. **Issues List (/issues)**
   - Fetches and displays issues from API
   - Search functionality by title with debouncing
   - Filter by status (todo/in_progress/done)
   - Shows title, description, status chip, priority tag, last updated date, and assignee
   - Loading, empty, and error states implemented

2. **Issue Details (/issues/:id)**
   - Full issue details display
   - Back to list navigation
   - Error state for invalid IDs

3. **Create & Edit (/issues/new, /issues/:id/edit)**
   - Reactive forms with validation
   - Required field validation with error messages
   - Save to API functionality
   - Navigation on success

4. **Accessibility & UX**
   - Proper labels for all inputs
   - Keyboard navigation support
   - Focus management on route changes
   - ARIA attributes for screen readers

5. **Project Structure**
   - Clear separation of concerns
   - Models in /models directory
   - Services for API communication
   - Standalone components architecture

## Technical Stack

- **Angular 17+** with Standalone Components
- **TypeScript** for type safety
- **Angular Material** for UI components
- **RxJS** for reactive programming
- **Angular Signals** for state management
- **Reactive Forms** for form handling

## Architecture Decisions

### State Management
- Used Angular Signals for reactive state management
- RxJS services for API communication and data flow
- Component-level state for UI-specific data

### Styling Approach
- Angular Material for consistent UI components
- Custom SCSS for specific styling needs
- Responsive design with mobile-first approach
- Color scheme following assessment guidelines:
  - Primary: #1E88E5
  - Text: #0F172A / #475569
  - Status chips: todo (gray), in_progress (amber), done (green)

### Error Handling
- Comprehensive error states in all components
- User-friendly error messages
- Retry functionality for failed operations
- Loading states for better UX

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   ├── models/             # TypeScript interfaces
│   │   └── issue.model.ts
│   ├── pages/              # Page components
│   │   ├── issue-details/
│   │   ├── issue-form/
│   │   └── issues-list/
│   ├── services/           # API services
│   │   └── issues.service.ts
│   ├── app.config.ts       # App configuration
│   ├── app.routes.ts       # Routing configuration
│   └── app.ts              # Root component
├── index.html
├── main.ts
└── styles.scss
```

## Installation & Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm or yarn
   - Angular CLI

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`

4. **Build for Production**
   ```bash
   ng build
   ```
   Build artifacts will be stored in the `dist/` directory.

## API Requirements

The application expects a JSON server with the following endpoints:

- `GET /issues` - List all issues (supports query parameters: q, status, _page, _limit)
- `GET /issues/:id` - Get single issue
- `POST /issues` - Create new issue
- `PATCH /issues/:id` - Update issue
- `DELETE /issues/:id` - Delete issue

### Sample API Setup with json-server

1. Install json-server: `npm install -g json-server`
2. Create `db.json` with sample data
3. Run: `json-server --watch db.json --port 3000`

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile** (≤ 600px): Stacked card layout
- **Tablet** (600-1024px): Two-column grid
- **Desktop** (≥ 1024px): Multi-column grid layout

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast color scheme (4.5:1 ratio)

## Known Limitations & Trade-offs

1. **Mock API Dependency**: Application requires external API server
2. **No Offline Support**: No service worker or offline capabilities
3. **Basic Error Handling**: Could be enhanced with more specific error types
4. **No Unit Tests**: Due to time constraints, comprehensive testing not implemented

## Future Enhancements

1. **Stretch Goals Implementation**:
   - Client-side pagination
   - URL persistence for filters
   - Kanban board view
   - Comprehensive test suite

2. **Performance Optimizations**:
   - OnPush change detection strategy
   - Lazy loading for large datasets
   - Virtual scrolling for long lists

3. **Enhanced UX**:
   - Drag-and-drop functionality
   - Bulk operations
   - Advanced filtering options
   - Real-time updates with WebSockets

## Development Notes

- Built with Angular 17+ standalone components architecture
- Follows Angular style guide and best practices
- Uses Angular Material for consistent UI/UX
- Implements reactive programming patterns with RxJS
- Responsive design with mobile-first approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Catalyst Frontend Assessment and is for evaluation purposes only.

