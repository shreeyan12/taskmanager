from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Task, Category, TaskComment
from .forms import TaskForm, CategoryForm, TaskCommentForm


@login_required
def task_list(request):
    tasks = Task.objects.filter(user=request.user)
    categories = Category.objects.all()
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        tasks = tasks.filter(status=status_filter)
    
    # Filter by category
    category_filter = request.GET.get('category')
    if category_filter:
        tasks = tasks.filter(category_id=category_filter)
    
    # Filter by priority
    priority_filter = request.GET.get('priority')
    if priority_filter:
        tasks = tasks.filter(priority=priority_filter)
    
    context = {
        'tasks': tasks,
        'categories': categories,
        'status_filter': status_filter,
        'category_filter': category_filter,
        'priority_filter': priority_filter,
    }
    return render(request, 'tasks/task_list.html', context)


@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            messages.success(request, 'Task created successfully!')
            return redirect('task_list')
    else:
        form = TaskForm()
    
    return render(request, 'tasks/task_form.html', {'form': form, 'title': 'Create Task'})


@login_required
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    comments = TaskComment.objects.filter(task=task)
    
    if request.method == 'POST':
        comment_form = TaskCommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.task = task
            comment.user = request.user
            comment.save()
            messages.success(request, 'Comment added successfully!')
            return redirect('task_detail', pk=pk)
    else:
        comment_form = TaskCommentForm()
    
    context = {
        'task': task,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, 'tasks/task_detail.html', context)


@login_required
def task_edit(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'Task updated successfully!')
            return redirect('task_detail', pk=pk)
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'tasks/task_form.html', {'form': form, 'title': 'Edit Task', 'task': task})


@login_required
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    
    if request.method == 'POST':
        task.delete()
        messages.success(request, 'Task deleted successfully!')
        return redirect('task_list')
    
    return render(request, 'tasks/task_confirm_delete.html', {'task': task})


@login_required
@require_POST
def task_toggle_status(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    
    if task.status == 'completed':
        task.status = 'todo'
    else:
        task.status = 'completed'
    
    task.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        status_display = dict(Task.STATUS_CHOICES).get(task.status, task.status)
        return JsonResponse({
            'status': task.status,
            'message': f'Task marked as {status_display}'
        })
    
    return redirect('task_list')


@login_required
def category_list(request):
    categories = Category.objects.all()
    return render(request, 'tasks/category_list.html', {'categories': categories})


@login_required
def category_create(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Category created successfully!')
            return redirect('category_list')
    else:
        form = CategoryForm()
    
    return render(request, 'tasks/category_form.html', {'form': form, 'title': 'Create Category'})



# API endpoints for task assignment and ordering
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json


@login_required
@require_POST
def update_task_order(request):
    """API endpoint to update task order for drag-and-drop functionality"""
    try:
        data = json.loads(request.body)
        task_ids = data.get('task_ids', [])
        
        for index, task_id in enumerate(task_ids):
            Task.objects.filter(id=task_id, user=request.user).update(order=index)
        
        return JsonResponse({'success': True, 'message': 'Task order updated successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def update_task_status(request, pk):
    """API endpoint to update task status"""
    try:
        task = get_object_or_404(Task, pk=pk, user=request.user)
        data = json.loads(request.body)
        new_status = data.get('status')
        
        if new_status in dict(Task.STATUS_CHOICES):
            task.status = new_status
            task.save()
            return JsonResponse({
                'success': True, 
                'message': f'Task status updated to {dict(Task.STATUS_CHOICES).get(task.status, task.status)}'
            })
        else:
            return JsonResponse({'success': False, 'error': 'Invalid status'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def assign_task(request, pk):
    """API endpoint to assign task to a user"""
    try:
        task = get_object_or_404(Task, pk=pk, user=request.user)
        data = json.loads(request.body)
        user_id = data.get('user_id')
        
        if user_id:
            assigned_user = get_object_or_404(User, pk=user_id)
            task.assigned_to = assigned_user
        else:
            task.assigned_to = None
        
        task.save()
        
        assigned_name = getattr(task.assigned_to, 'username', 'Unassigned')
        return JsonResponse({
            'success': True, 
            'message': f'Task assigned to {assigned_name}',
            'assigned_to': assigned_name
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
def get_users(request):
    """API endpoint to get list of users for task assignment"""
    users = User.objects.all().values('id', 'username', 'first_name', 'last_name')
    return JsonResponse({'users': list(users)})

