<template>
  <section class="hero">
    <h2>Bienvenido al Sistema de Gestión de Biblioteca</h2>
    <p>Gestiona libros, ejemplares, préstamos y usuarios de manera eficiente</p>
  </section>

  <section id="stats" class="mt-4">
    <div class="row">
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body">
            <h5 class="card-title">Libros Registrados</h5>
            <p class="card-text">{{ librosCount }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body">
            <h5 class="card-title">Ejemplares Disponibles</h5>
            <p class="card-text">{{ ejemplaresDisponibles }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body">
            <h5 class="card-title">Préstamos Activos</h5>
            <p class="card-text">{{ prestamosActivos }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      librosCount: 0,
      ejemplaresDisponibles: 0,
      prestamosActivos: 0
    }
  },
  mounted() {
    this.obtenerEstadisticas()
  },
  methods: {
    async obtenerEstadisticas() {
      try {
        const [librosRes, ejemplaresRes, prestamosRes] = await Promise.all([
          this.axios.get('/libros'),
          this.axios.get('/ejemplares?estado=disponible'),
          this.axios.get('/prestamos?estado=activo')
        ])
        
        this.librosCount = librosRes.data.length
        this.ejemplaresDisponibles = ejemplaresRes.data.length
        this.prestamosActivos = prestamosRes.data.length
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error)
      }
    }
  }
}
</script>

<style scoped>
.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card .card-title {
  color: #6c757d;
  font-size: 1rem;
}

.stat-card .card-text {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}
</style>