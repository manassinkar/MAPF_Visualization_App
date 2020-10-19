from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('getPath.urls'))
    #path('', TemplateView.as_view(template_name='index.html')),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
