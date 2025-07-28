import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Login.view.vue'
import EncargadosList from '@/views/encargados/EncargadosList.vue'
import UsuariosList from '@/views/usuarios/UsuariosList.vue'
import LibrosList from '@/views/libros/LibrosList.vue'
import EjemplaresList from '@/views/ejemplares/EjemplaresList.vue'
import PrestamosList from '@/views/prestamos/PrestamosList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/encargados',
    name: 'encargados',
    component: EncargadosList,
    meta: { requiresAuth: true, role: ['administrador'] }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosList,
    meta: { requiresAuth: true, role: ['administrador', 'encargado'] }
  },
  {
    path: '/libros',
    name: 'libros',
    component: LibrosList,
    meta: { requiresAuth: true, role: ['administrador', 'encargado'] }
  },
  {
    path: '/ejemplares',
    name: 'ejemplares',
    component: EjemplaresList,
    meta: { requiresAuth: true, role: ['administrador', 'encargado'] }
  },
  {
    path: '/prestamos',
    name: 'prestamos',
    component: PrestamosList,
    meta: { requiresAuth: true, role: ['administrador', 'encargado'] }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('rol') || ''
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.meta.role.includes(userRole)) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router