// Custom JavaScript for TaskZen

// Auto-hide alerts after 5 seconds
setTimeout(function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    });
}, 5000);

// Add loading state to buttons
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
        }
    });
});

// Load SortableJS from CDN and initialize drag and drop functionality
function loadSortableJS() {
    if (typeof Sortable !== 'undefined') {
        initializeDragAndDrop();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
    script.onload = function() {
        initializeDragAndDrop();
    };
    document.head.appendChild(script);
}

// Drag and drop functionality for task prioritization
function initializeDragAndDrop() {
    const taskList = document.getElementById('task-list');
    if (!taskList || typeof Sortable === 'undefined') return;

    new Sortable(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.task-card',
        onStart: function(evt) {
            evt.item.classList.add('dragging');
        },
        onEnd: function(evt) {
            evt.item.classList.remove('dragging');
            
            // Get the new order of tasks
            const taskIds = Array.from(taskList.children).map(item => item.dataset.taskId);
            
            // Send AJAX request to update task order
            fetch('/tasks/update-order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    task_ids: taskIds
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Task order updated successfully', 'success');
                } else {
                    showNotification('Failed to update task order', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating task order:', error);
                showNotification('Error updating task order', 'error');
            });
        }
    });
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Task status update functionality
function updateTaskStatus(taskId, status) {
    fetch(`/tasks/${taskId}/update-status/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            location.reload(); // Reload to show updated status
        } else {
            showNotification('Failed to update task status', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating task status:', error);
        showNotification('Error updating task status', 'error');
    });
}

// Task assignment functionality
function assignTask(taskId, userId) {
    fetch(`/tasks/${taskId}/assign/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            // Update the assignment display
            const assignmentElement = document.querySelector(`[data-task-id="${taskId}"] .assignment-display`);
            if (assignmentElement) {
                assignmentElement.textContent = data.assigned_to;
            }
        } else {
            showNotification('Failed to assign task', 'error');
        }
    })
    .catch(error => {
        console.error('Error assigning task:', error);
        showNotification('Error assigning task', 'error');
    });
}

// Filter tasks functionality
function filterTasks() {
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const priorityFilter = document.getElementById('priority-filter')?.value || '';
    
    const url = new URL(window.location);
    if (statusFilter) url.searchParams.set('status', statusFilter);
    else url.searchParams.delete('status');
    
    if (categoryFilter) url.searchParams.set('category', categoryFilter);
    else url.searchParams.delete('category');
    
    if (priorityFilter) url.searchParams.set('priority', priorityFilter);
    else url.searchParams.delete('priority');
    
    window.location.href = url.toString();
}

// Search tasks functionality
function searchTasks() {
    const searchQuery = document.getElementById('search-input')?.value || '';
    const url = new URL(window.location);
    
    if (searchQuery) url.searchParams.set('search', searchQuery);
    else url.searchParams.delete('search');
    
    window.location.href = url.toString();
}

// Clear all filters
function clearFilters() {
    const url = new URL(window.location);
    url.search = '';
    window.location.href = url.toString();
}

// Show notification
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'error' ? 'alert-danger' : 
                     type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show fade-in" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterbegin', alertHtml);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSortableJS();
    
    // Add event listeners for filter changes
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const priorityFilter = document.getElementById('priority-filter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterTasks);
    if (categoryFilter) categoryFilter.addEventListener('change', filterTasks);
    if (priorityFilter) priorityFilter.addEventListener('change', filterTasks);
    
    // Add event listener for search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTasks();
            }
        });
    }
    
    // Add click handlers for status updates
    document.querySelectorAll('.status-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            const newStatus = this.dataset.newStatus;
            updateTaskStatus(taskId, newStatus);
        });
    });
    
    // Add change handlers for assignment dropdowns
    document.querySelectorAll('.assignment-select').forEach(select => {
        select.addEventListener('change', function() {
            const taskId = this.dataset.taskId;
            const userId = this.value || null;
            assignTask(taskId, userId);
        });
    });
});

