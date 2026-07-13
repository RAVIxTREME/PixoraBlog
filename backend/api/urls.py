from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.current_user, name='current_user'),

    path('posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', views.toggle_like, name='toggle-like'),
    path('posts/<int:post_id>/comment/', views.add_comment, name='add-comment'),
    path('comments/<int:comment_id>/', views.delete_comment, name='delete-comment'),

    path('home/', views.home_feed, name='home-feed'),
    path('profile/<str:username>/', views.profile, name='profile'),
    path('profile/<str:username>/follow/', views.toggle_follow, name='toggle-follow'),

    path('set-username/', views.set_username, name='set-username'),
    path('save-location/', views.save_location, name='save-location'),
    path('people-suggestions/', views.people_suggestions, name='people-suggestions'),
]