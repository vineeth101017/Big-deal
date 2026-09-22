from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^health/?$', views.health, name='health'),
    re_path(r'^auth/register/?$', views.register_user, name='register_user'),
    re_path(r'^auth/login/?$', views.login_user, name='login_user'),
    re_path(r'^admin/login/?$', views.admin_login, name='admin_login'),
    
    re_path(r'^products/?$', views.get_products, name='get_products'),
    re_path(r'^products/search/?$', views.search_products, name='search_products'),
    re_path(r'^categories/?$', views.get_categories, name='get_categories'),
    re_path(r'^price-range/?$', views.get_price_range, name='get_price_range'),
    re_path(r'^products/(?P<product_id>\d+)/reviews/?$', views.product_reviews, name='product_reviews'),
    
    re_path(r'^checkout/?$', views.checkout, name='checkout'),
    re_path(r'^promo/apply/?$', views.apply_promo, name='apply_promo'),
    re_path(r'^users/orders/?$', views.get_user_orders, name='get_user_orders'),
    re_path(r'^users/wishlist/?$', views.user_wishlist, name='user_wishlist'),
    
    re_path(r'^admin/orders/?$', views.get_admin_orders, name='get_admin_orders'),
    re_path(r'^admin/orders/(?P<order_id>\d+)/status/?$', views.update_admin_order_status, name='update_admin_order_status'),
    re_path(r'^admin/products/?$', views.create_admin_product, name='create_admin_product'),
    re_path(r'^admin/products/(?P<product_id>\d+)/?$', views.admin_product_detail, name='admin_product_detail'),
    re_path(r'^admin/products/(?P<product_id>\d+)/stock/?$', views.update_admin_product_stock, name='update_admin_product_stock'),
    re_path(r'^admin/promos/?$', views.admin_promos, name='admin_promos'),
    re_path(r'^admin/promos/(?P<code>[\w-]+)/toggle/?$', views.toggle_admin_promo, name='toggle_admin_promo'),
]
