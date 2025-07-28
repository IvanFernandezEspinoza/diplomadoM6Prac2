<template>
  <div>
    <h1>Préstamos</h1>
    <button type="button" class="btn btn-primary mb-3" @click="abrirModalParaCrear()">
      Nuevo Préstamo
    </button>
    
    <div class="mb-3">
      <div class="input-group">
        <span class="input-group-text">Filtrar por estado</span>
        <select v-model="estadoFiltro" class="form-select" @change="filtrarPrestamos">
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="devuelto">Devueltos</option>
          <option value="vencido">Vencidos</option>
        </select>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Ejemplar</th>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Encargado</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsFiltrados" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ obtenerCodigoEjemplar(item.ejemplarId) }}</td>
            <td>{{ obtenerTituloLibro(item.ejemplarId) }}</td>
            <td>{{ obtenerNombreUsuario(item.usuarioId) }}</td>
            <td>{{ obtenerNombreEncargado(item.encargadoId) }}</td>
            <td>{{ formatearFecha(item.fecha_prestamo) }}</td>
            <td>{{ formatearFecha(item.fecha_devolucion_estimada) }}</td>
            <td>
              <span :class="`badge bg-${obtenerClaseEstado(item.estado)}`">
                {{ item.estado }}
              </span>
            </td>
            <td>
              <button v-if="item.estado === 'activo'" 
                      class="btn btn-sm btn-success me-2" 
                      @click="registrarDevolucion(item)">
                Devolver
              </button>
              <button class="btn btn-sm btn-warning me-2" 
                      @click="abrirModalParaEditar(item)">
                Editar
              </button>
              <button class="btn btn-sm btn-danger" 
                      @click="eliminar(item)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="prestamoModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <PrestamosCrear 
              v-if="modalMode === 'crear'" 
              :ejemplares="ejemplaresDisponibles" 
              :usuarios="usuarios"
              :encargados="encargados"
              @created="nuevo($event)" 
            />
            <PrestamosEditar 
              v-if="modalMode === 'editar'" 
              :item="itemSeleccionado" 
              :ejemplares="ejemplares"
              :usuarios="usuarios"
              :encargados="encargados"
              @updated="modificar($event)" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import PrestamosCrear from './PrestamosCrear.vue'
import PrestamosEditar from './PrestamosEditar.vue'

export default {
  name: 'PrestamosList',
  components: {
    PrestamosCrear,
    PrestamosEditar
  },
  data() {
    return {
      items: [],
      ejemplares: [],
      usuarios: [],
      encargados: [],
      libros: [], 
      itemsFiltrados: [],
      estadoFiltro: '',
      modal: null,
      modalMode: 'crear',
      modalTitle: 'Nuevo Préstamo',
      itemSeleccionado: null
    }
  },
  computed: {
    ejemplaresDisponibles() {
      return this.ejemplares.filter(e => e.estado === 'disponible')
    }
  },
  async mounted() {
    this.modal = new Modal(this.$refs.modalRef)
    await Promise.all([
      this.obtenerEjemplares(),
      this.obtenerUsuarios(),
      this.obtenerEncargados(),
      this.obtenerLibros(),
      this.obtenerLista()
    ])
  },
  methods: {
    async obtenerLibros() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/libros`)
        this.libros = response.data
      } catch (error) {
        console.error('Error obteniendo libros:', error)
        alert('Error al cargar los libros')
      }
    },
    async obtenerEjemplares() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/ejemplares`)
        this.ejemplares = response.data
      } catch (error) {
        console.error('Error obteniendo ejemplares:', error)
        alert('Error al cargar los ejemplares')
      }
    },
    async obtenerUsuarios() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/usuarios`)
        this.usuarios = response.data
      } catch (error) {
        console.error('Error obteniendo usuarios:', error)
        alert('Error al cargar los usuarios')
      }
    },
    async obtenerEncargados() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/encargados`)
        this.encargados = response.data
      } catch (error) {
        console.error('Error obteniendo encargados:', error)
        alert('Error al cargar los encargados')
      }
    },
    async obtenerLista() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/prestamos`)
        this.items = response.data
        this.itemsFiltrados = [...this.items]
      } catch (error) {
        console.error('Error obteniendo préstamos:', error)
        alert('Error al cargar los préstamos')
      }
    },
    filtrarPrestamos() {
      this.itemsFiltrados = this.items.filter(item => {
        return this.estadoFiltro === '' || item.estado === this.estadoFiltro
      })
    },
    obtenerCodigoEjemplar(ejemplarId) {
      const ejemplar = this.ejemplares.find(e => e.id == ejemplarId)
      return ejemplar ? ejemplar.codigo : 'Desconocido'
    },
    obtenerTituloLibro(ejemplarId) {
      const ejemplar = this.ejemplares.find(e => e.id == ejemplarId)
      if (!ejemplar) return 'Desconocido'
      
      const libro = this.libros.find(l => l.id == ejemplar.libroId)
      return libro ? libro.titulo : 'Desconocido'
    },
    obtenerNombreUsuario(usuarioId) {
      const usuario = this.usuarios.find(u => u.id == usuarioId)
      return usuario ? usuario.nombre : 'Desconocido'
    },
    obtenerNombreEncargado(encargadoId) {
      const encargado = this.encargados.find(e => e.id == encargadoId)
      return encargado ? encargado.nombre : 'Desconocido'
    },
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      return new Date(fecha).toLocaleDateString('es-ES')
    },
    obtenerClaseEstado(estado) {
      switch (estado) {
        case 'activo': return 'success'
        case 'devuelto': return 'primary'
        case 'vencido': return 'danger'
        default: return 'secondary'
      }
    },
    abrirModalParaCrear() {
      this.modalMode = 'crear'
      this.modalTitle = 'Nuevo Préstamo'
      this.modal.show()
    },
    abrirModalParaEditar(item) {
      this.modalMode = 'editar'
      this.modalTitle = 'Editar Préstamo'
      this.itemSeleccionado = { ...item }
      this.modal.show()
    },
    cerrarModal() {
      this.modal.hide()
    },
    async nuevo(item) {
      try {
        // Registrar el préstamo
        await this.axios.post(`${process.env.VUE_APP_API_URL}/prestamos`, item)
        
        // Actualizar estado del ejemplar
        await this.axios.patch(`${process.env.VUE_APP_API_URL}/ejemplares/${item.ejemplarId}`, {
          estado: 'prestado'
        })
        
        this.cerrarModal()
        await this.obtenerLista()
        await this.obtenerEjemplares()
        alert('Préstamo registrado con éxito')
      } catch (error) {
        console.error('Error creando préstamo:', error)
        alert('Error al registrar el préstamo')
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`${process.env.VUE_APP_API_URL}/prestamos/${item.id}`, item)
        this.cerrarModal()
        await this.obtenerLista()
        alert('Préstamo actualizado con éxito')
      } catch (error) {
        console.error('Error actualizando préstamo:', error)
        alert('Error al actualizar el préstamo')
      }
    },
    async registrarDevolucion(item) {
      if (confirm('¿Registrar devolución de este ejemplar?')) {
        try {
          const hoy = new Date().toISOString().split('T')[0]
          
          // Actualizar préstamo
          await this.axios.patch(`${process.env.VUE_APP_API_URL}/prestamos/${item.id}`, {
            estado: 'devuelto',
            fecha_devolucion_real: hoy
          })
          
          // Actualizar estado del ejemplar
          await this.axios.patch(`${process.env.VUE_APP_API_URL}/ejemplares/${item.ejemplarId}`, {
            estado: 'disponible'
          })
          
          await this.obtenerLista()
          await this.obtenerEjemplares()
          alert('Devolución registrada con éxito')
        } catch (error) {
          console.error('Error registrando devolución:', error)
          alert('Error al registrar la devolución')
        }
      }
    },
    async eliminar(item) {
      if (confirm(`¿Está seguro de eliminar el préstamo ${item.id}?`)) {
        try {
          await this.axios.delete(`${process.env.VUE_APP_API_URL}/prestamos/${item.id}`)
          
          // Si el préstamo estaba activo, marcar el ejemplar como disponible
          if (item.estado === 'activo') {
            await this.axios.patch(`${process.env.VUE_APP_API_URL}/ejemplares/${item.ejemplarId}`, {
              estado: 'disponible'
            })
          }
          
          await this.obtenerLista()
          await this.obtenerEjemplares()
          alert('Préstamo eliminado con éxito')
        } catch (error) {
          console.error('Error eliminando préstamo:', error)
          alert('Error al eliminar el préstamo')
        }
      }
    }
  }
}
</script>
<style scoped>
.badge {
  font-size: 0.9em;
  padding: 0.5em 0.75em;
  text-transform: capitalize;
}
</style>