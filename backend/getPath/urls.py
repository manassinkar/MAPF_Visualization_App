from django.urls import path, include
from .views import getMaze_And_Path, generate_random_maze, generate_random_start_end

urlpatterns = [
    path('', getMaze_And_Path, name='getMaze_And_Path'),
    path('app/maze', generate_random_maze, name='generate_random_maze'),
    path('app/startend/', generate_random_start_end, name='generate_random_start_end')
]

