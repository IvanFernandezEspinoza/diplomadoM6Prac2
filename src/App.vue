<template>
  <header>
    <h1><router-link to="/">Sistema Biblioteca</router-link></h1>
    <nav>
      <router-link v-if="isLogin && tieneAutorizacion(['administrador'])" to="/encargados">Encargados</router-link>
      <router-link v-if="isLogin && tieneAutorizacion(['administrador', 'encargado'])" to="/usuarios">Usuarios</router-link>
      <router-link v-if="isLogin && tieneAutorizacion(['administrador', 'encargado'])" to="/libros">Libros</router-link>
      <router-link v-if="isLogin && tieneAutorizacion(['administrador', 'encargado'])" to="/ejemplares">Ejemplares</router-link>
      <router-link v-if="isLogin && tieneAutorizacion(['administrador', 'encargado'])" to="/prestamos">Préstamos</router-link>
      <router-link v-if="!isLogin" to="/login">Login</router-link>
    </nav>
  </header>

  <div v-if="isLogin" class="user-info">
    {{ getNombre }} | {{ getRol }} | [ <a @click="logout()">Salir</a> ]
  </div>

  <div class="contenedor-principal">
    <router-view />
  </div>

  <footer>
    <p>&copy; 2023 Sistema de Biblioteca. Todos los derechos reservados.</p>
  </footer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['clearToken', 'setRol']),
    logout() {
      localStorage.removeItem('rol')
      localStorage.removeItem('token')
      localStorage.removeItem('nombre')
      this.clearToken()
      this.setRol('')
      this.$router.push('/login')
    },
    tieneAutorizacion(roles) {
      return roles.includes(this.getRol)
    }
  },
  computed: {
    ...mapState(['rol']),
    ...mapGetters(['isLogin', 'getRol', 'getNombre'])
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  color: #333;
  line-height: 1.6;
}

header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

header h1 a {
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
}

nav a {
  margin-left: 1rem;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
}

.user-info {
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  text-align: right;
}

.user-info a {
  cursor: pointer;
  color: #007bff;
}

.contenedor-principal {
  padding: 2rem;
  min-height: calc(100vh - 120px);
}

footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    margin-top: 1rem;
  }

  nav a {
    margin: 0 0.5rem 0 0;
  }
}
</style>