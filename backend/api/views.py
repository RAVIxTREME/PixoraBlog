from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from .models import Post, Like, Comment, Follow, Profile
from .serializers import PostSerializer, PostDetailSerializer, CommentSerializer, UserSerializer


# ---------- AUTH ----------

import uuid

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    # Temporary unique username — user isse baad mein change karega
    temp_username = f"user_{uuid.uuid4().hex[:10]}"
    user = User.objects.create_user(username=temp_username, email=email, password=password)
    Profile.objects.create(user=user, username_set=False)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'username': user.username,
        'username_set': False,
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    identifier = request.data.get('username')  # email ya username, jo bhi diya ho
    password = request.data.get('password')

    user = None
    # pehle username se try karo
    user = authenticate(username=identifier, password=password)

    # agar nahi mila, email se dhoondo
    if user is None:
        try:
            matched_user = User.objects.get(email=identifier)
            user = authenticate(username=matched_user.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is None:
        return Response({'error': 'Invalid credentials'}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
    profile, _ = Profile.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'username': user.username,
        'username_set': profile.username_set,
    })

@api_view(['POST'])
def set_username(request):
    new_username = request.data.get('username', '').strip()

    if not new_username:
        return Response({'error': 'Username is required'}, status=400)
    if len(new_username) < 3:
        return Response({'error': 'Username must be at least 3 characters'}, status=400)
    if User.objects.filter(username=new_username).exclude(id=request.user.id).exists():
        return Response({'error': 'Username already taken'}, status=400)

    request.user.username = new_username
    request.user.save()

    profile, _ = Profile.objects.get_or_create(user=request.user)
    profile.username_set = True
    profile.save()

    return Response({'username': new_username, 'username_set': True})


@api_view(['POST'])
def save_location(request):
    lat = request.data.get('lat')
    lng = request.data.get('lng')
    city = request.data.get('city', '')

    profile, _ = Profile.objects.get_or_create(user=request.user)
    profile.location_lat = lat
    profile.location_lng = lng
    profile.location_city = city
    profile.save()

    return Response({'status': 'saved'})


@api_view(['GET'])
def people_suggestions(request):
    # V1: koi real suggestion logic nahi, khaali list bhejo
    # V2/V3 mein: location-based nearby users dhoondenge
    return Response({'suggestions': []})


@api_view(['GET'])
def current_user(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Not logged in'}, status=401)
    profile, _ = Profile.objects.get_or_create(user=request.user)
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'username_set': profile.username_set,
    })
@api_view(['POST'])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message':'Logged out'})

# ---------- POSTS ----------

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostDetailSerializer

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['GET'])
def home_feed(request):
    """Posts from users the current user follows"""
    following_ids = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
    posts = Post.objects.filter(user__in=following_ids)
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


# ---------- LIKES ----------

@api_view(['POST'])
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    like, created = Like.objects.get_or_create(user=request.user, post=post)
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    return Response({'liked': liked, 'count': post.likes.count()})


# ---------- COMMENTS ----------

@api_view(['POST'])
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    text = request.data.get('text', '').strip()
    if not text:
        return Response({'error': 'Comment cannot be empty'}, status=400)
    comment = Comment.objects.create(user=request.user, post=post, text=text)
    return Response(CommentSerializer(comment).data, status=201)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    comment.delete()
    return Response(status=204)


# ---------- FOLLOW ----------

@api_view(['POST'])
def toggle_follow(request, username):
    target_user = get_object_or_404(User, username=username)
    if request.user == target_user:
        return Response({'error': "Can't follow yourself"}, status=400)
    follow, created = Follow.objects.get_or_create(follower=request.user, following=target_user)
    if not created:
        follow.delete()
        following = False
    else:
        following = True
    return Response({'following': following})


# ---------- PROFILE ----------

@api_view(['GET'])
def profile(request, username):
    profile_user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(user=profile_user)
    is_following = False
    if request.user.is_authenticated:
        is_following = Follow.objects.filter(follower=request.user, following=profile_user).exists()
    return Response({
        'user': UserSerializer(profile_user).data,
        'posts': PostSerializer(posts, many=True, context={'request': request}).data,
        'is_following': is_following,
        'followers_count': Follow.objects.filter(following=profile_user).count(),
        'following_count': Follow.objects.filter(follower=profile_user).count(),
    })