<template>
  <div class="login-container">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="login()">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="tucorreo@biblioteca.com" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" v-model="password" class="form-control" id="password" placeholder="********" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Entrar</button>
      </form>
      <div style="color: red;">
        <br>
        <p>
          datos sugeridos: 
        </p>
        <p>
          <strong>Correo:</strong> <p> ivan@biblioteca.com</p>
          <strong>Contraseña:</strong> <p> admin123</p>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['setToken', 'setRol', 'setNombre']),
    async login() {
      try {
        
        // const response = await this.axios.get(`http://localhost:4000/encargados?email=${this.email}&password=${this.password}`)
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/encargados?email=${this.email}&password=${this.password}`)

        if (response.data.length === 0) {
          alert('Credenciales incorrectas. Intente nuevamente.')
          return
        }

        const user = response.data[0]
        
        localStorage.setItem('rol', user.rol)
        localStorage.setItem('nombre', user.nombre)
        localStorage.setItem('token', 'fake-jwt-token')
        
        this.setRol(user.rol)
        this.setNombre(user.nombre)
        this.setToken('fake-jwt-token')
        
        this.$router.push('/')
      } catch (error) {
        console.error('Error en login:', error)
        alert('Ocurrió un error al iniciar sesión')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
}
</style>