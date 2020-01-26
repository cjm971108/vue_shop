import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
const Users = () => import(/* webpackChunkName:"user" */ './components/user/Users.vue')
const Rights = () => import(/* webpackChunkName:"power" */ './components/rights/Rights.vue')
const Role = () => import(/* webpackChunkName:"power" */ './components/rights/Role.vue')
const Categories = () => import(/* webpackChunkName:"goods" */ './components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName:"goods" */ './components/goods/Params.vue')
const Goods = () => import(/* webpackChunkName:"goods" */ './components/goods/Goods.vue')
const Orders = () => import(/* webpackChunkName:"order" */ './components/Orders.vue')
const Report = () => import(/* webpackChunkName:"report" */ './components/Report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/roles',
          component: Role
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  return next()
})
export default router
