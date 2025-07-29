from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('create/', views.task_create, name='task_create'),
    path('<int:pk>/', views.task_detail, name='task_detail'),
    path('<int:pk>/edit/', views.task_edit, name='task_edit'),
    path('<int:pk>/delete/', views.task_delete, name='task_delete'),
    path('<int:pk>/toggle-status/', views.task_toggle_status, name='task_toggle_status'),
    
    # API endpoints
    path('update-order/', views.update_task_order, name='update_task_order'),
    path('<int:pk>/update-status/', views.update_task_status, name='update_task_status'),
    path('<int:pk>/assign/', views.assign_task, name='assign_task'),
    path('users/', views.get_users, name='get_users'),
    
    # Categories
    path('categories/', views.category_list, name='category_list'),
    path('categories/create/', views.category_create, name='category_create'),
]

