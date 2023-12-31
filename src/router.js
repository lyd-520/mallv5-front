import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home'
import Index from './pages/newIndex'
Vue.use(Router);

export default new Router({
  // base:'/mallv5-front/',
  routes:[
    {
      path:'/',
      name:'home',
      component:Home,
      redirect:'/index',
      children:[
        {
          path: '/index',
          name: 'index',
          component: Index,
        },
        {
          path: '/index_old',
          name: 'index_old',
          component: () => import('./pages/index.vue'),
        }, {
          path: '/product/:id',
          name: 'product',
          component: () => import('./pages/product.vue')
        }, {
          path: '/detail/:id',
          name: 'detail',
          component: () => import('./pages/detail.vue')
        }, {
          path: '/secKillDetail/:id/:flashPromotionId/:flashRelationId',
          name: 'secKillDetail',
          component: () => import('./pages/secKillDetail.vue')
        }, {
          path: '/secKillOrderConfirm/:id/:token',
          name: 'secKillOrderConfirm',
          component: () => import('./pages/secKillOrderConfirm.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('./pages/cart.vue')
    },
    {
      path: '/searchResult/:keyword',
      name: 'searchResult',
      component: () => import('./pages/searchResult.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('./pages/order.vue'),
      children:[
        {
          path: 'list',
          name: 'order-list',
          component: () => import('./pages/orderList.vue')
        },
        {
          path: 'status/:id/:itemIds',
          name: 'order-status-check',
          component: () => import('./pages/orderStatusCheck.vue')
        },
        {
          path: 'confirm',
          name: 'order-confirm',
          component: () => import('./pages/orderConfirm.vue')
        },
        {
          path: 'pay',
          name: 'order-pay',
          component: () => import('./pages/orderPay.vue')
        },
        {
          path: 'alipay',
          name: 'alipay',
          component: () => import('./pages/alipay.vue')
        }
      ]
    }
  ]
});