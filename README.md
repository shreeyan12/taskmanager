# TaskZen - Modern Task Management Application

TaskZen is a comprehensive task management application built with Django, featuring a clean, minimalistic UI and powerful functionality for organizing and tracking tasks.

## 🚀 Live Application
**URL:** https://taskmanager-2-7mrw.onrender.com

## ✨ Key Features

### Core Functionality
- **Complete Authentication System** - Login, Signup, Logout, Password Reset
- **Task Management** - Create, Edit, Delete, View tasks with detailed information
- **Task Assignment** - Assign tasks to specific users
- **Priority System** - Urgent, High, Medium, Low priority levels with color coding
- **Status Tracking** - To Do, In Progress, Completed, Cancelled statuses
- **Category Organization** - Organize tasks by categories
- **Search & Filtering** - Advanced filtering by status, priority, category, and text search

### Advanced Features
- **Drag & Drop Prioritization** - Reorder tasks using SortableJS
- **Progress Tracking** - Visual status indicators and progress monitoring
- **Comment System** - Add comments to tasks for collaboration
- **Due Date Management** - Set and track task deadlines
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Technical Stack

### Backend
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API endpoints
- **SQLite** - Database
- **Django CORS Headers** - Cross-origin request handling

### Frontend
- **Bootstrap 5.3** - CSS framework
- **Custom CSS** - Minimalistic styling with TaskZen color scheme
- **SortableJS** - Drag and drop functionality
- **Vanilla JavaScript** - Interactive features

### Development Tools
- **Python 3.13** - Programming language
- **Virtual Environment** - Isolated dependencies
- **Django Admin** - Administrative interface

## 📁 Project Structure

```
taskmanager/
├── TaskZen/                 # Main project settings
│   ├── settings.py         # Django configuration
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI configuration
├── accounts/               # User authentication app
│   ├── models.py          # User models
│   ├── views.py           # Authentication views
│   ├── urls.py            # Auth URL patterns
│   └── forms.py           # Authentication forms
├── tasks/                  # Task management app
│   ├── models.py          # Task, Category, Comment models
│   ├── views.py           # Task CRUD views and API
│   ├── urls.py            # Task URL patterns
│   ├── forms.py           # Task forms
│   └── admin.py           # Admin configuration
├── templates/              # HTML templates
│   ├── base.html          # Base template
│   ├── accounts/          # Authentication templates
│   └── tasks/             # Task management templates
├── static/                 # Static files
│   ├── css/style.css      # Custom CSS
│   └── js/script.js       # Custom JavaScript
├── requirements.txt        # Python dependencies
├── built.sh               # build 
├── renderer.yaml          # deployed in renderer
└── manage.py              # Django management script
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.13.4
- pip (Python package manager)

### Local Development Setup

1. **Clone the repository:**
```bash
gh repo clone shreeyan12/taskmanager
cd taskmanager
```

2. **Create virtual environment:**
```bash
python3 -m venv taskmanager_env
taskmanager_env\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Start development server:**
```bash
python manage.py runserver
```

7. **Access the application:**
- Main app: http://localhost:8000
- Admin panel: http://localhost:8000/admin

## 📱 Usage Guide

### Getting Started
1. **Sign Up** - Create a new account or use demo credentials
2. **Login** - Access your personal task dashboard
3. **Create Tasks** - Add new tasks with titles, descriptions, priorities, and due dates
4. **Organize** - Use categories and priorities to organize your workflow
5. **Track Progress** - Update task statuses as you work

### Key Features Usage

#### Task Management
- **Create Task:** Click "New Task" button and fill in details
- **Edit Task:** Click on task title or use "Edit Task" action
- **Delete Task:** Use the delete action with confirmation
- **Filter Tasks:** Use status, priority, and category filters
- **Search:** Use the search bar to find specific tasks

#### Drag & Drop Prioritization
- **Reorder Tasks:** Drag task cards to reorder by priority
- **Visual Feedback:** Cards highlight during drag operations
- **Auto-save:** Order changes are automatically saved

#### Password Reset
- **Forgot Password:** Click "Forgot your password?" on login page
- **Email Reset:** Enter email to receive reset instructions
- **New Password:** Follow email link to set new password

## 🔐 Security Features

- **CSRF Protection** - Cross-site request forgery protection
- **User Authentication** - Secure login/logout system
- **Password Hashing** - Secure password storage
- **Session Management** - Secure session handling
- **Input Validation** - Form validation and sanitization

## 🎨 Design Philosophy

TaskZen follows a minimalistic design philosophy with:
- **Clean Interface** - Reduced visual clutter for better focus
- **Intuitive Navigation** - Easy-to-understand user flows
- **Consistent Styling** - Unified color scheme and typography
- **Responsive Design** - Optimal experience across all devices
- **Accessibility** - Proper contrast ratios and semantic HTML

## 🚀 Deployment

The application is configured for easy deployment with:
- **CORS Configuration** - Ready for frontend-backend separation
- **Static Files Handling** - Proper static file configuration
- **Database Migrations** - Automated database setup
- **Environment Variables** - Configurable settings

## 📊 API Endpoints

TaskZen includes REST API endpoints for:
- **Task CRUD Operations** - `/api/tasks/`
- **Task Ordering** - `/api/tasks/update-order/`
- **Task Assignment** - `/api/tasks/assign/`
- **User Authentication** - Standard Django auth endpoints
---

**TaskZen** - Simplifying task management with modern design and powerful features.

