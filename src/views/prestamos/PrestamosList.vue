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
            <td>{{ obtenerNombreUsuario(item.usuarioId) }}</td>
            <td>{{ obtenerNombreEncargado(item.encargadoId) }}</td>
            <td>{{ item.fecha_prestamo }}</td>
            <td>{{ item.fecha_devolucion_estimada }}</td>
            <td>
              <span :class="`badge bg-${obtenerClaseEstado(item.estado)}`">
                {{ item.estado }}
              </span>
            </td>
            <td>
              <button v-if="item.estado === 'activo'" class="btn btn-sm btn-success me-2" @click="registrarDevolucion(item)">
                Devolver
              </button>
              <button class="btn btn-sm btn-warning me-2" @click="abrirModalParaEditar(item)">
                Editar
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
              @created="nuevo($event)" 
            />
            <PrestamosEditar 
              v-if="modalMode === 'editar'" 
              :item="itemSeleccionado" 
              :ejemplares="ejemplares" 
              :usuarios="usuarios" 
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
    await this.obtenerEjemplares()
    await this.obtenerUsuarios()
    await this.obtenerEncargados()
    this.obtenerLista()
  },
  methods: {
    async obtenerEjemplares() {
      try {
        const response = await this.axios.get('/ejemplares?_expand=libro')
        this.ejemplares = response.data
      } catch (error) {
        console.error('Error obteniendo ejemplares:', error)
      }
    },
    async obtenerUsuarios() {
      try {
        const response = await this.axios.get('/usuarios')
        this.usuarios = response.data
      } catch (error) {
        console.error('Error obteniendo usuarios:', error)
      }
    },
    async obtenerEncargados() {
      try {
        const response = await this.axios.get('/encargados')
        this.encargados = response.data
      } catch (error) {
        console.error('Error obteniendo encargados:', error)
      }
    },
    async obtenerLista() {
      try {
        const response = await this.axios.get(process.env.VUE_APP_API_URL+'/prestamos')
        this.items = response.data
        this.itemsFiltrados = [...this.items]
      } catch (error) {
        console.error('Error obteniendo préstamos:', error)
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
    obtenerNombreUsuario(usuarioId) {
      const usuario = this.usuarios.find(u => u.id == usuarioId)
      return usuario ? usuario.nombre : 'Desconocido'
    },
    obtenerNombreEncargado(encargadoId) {
      const encargado = this.encargados.find(e => e.id == encargadoId)
      return encargado ? encargado.nombre : 'Desconocido'
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
        await this.axios.post('/prestamos', item)
        
        // Actualizar estado del ejemplar
        await this.axios.patch(`/ejemplares/${item.ejemplarId}`, {
          estado: 'prestado'
        })
        
        this.cerrarModal()
        this.obtenerLista()
        this.obtenerEjemplares()
      } catch (error) {
        console.error('Error creando préstamo:', error)
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`/prestamos/${item.id}`, item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error actualizando préstamo:', error)
      }
    },
    async registrarDevolucion(item) {
      if (confirm('¿Registrar devolución de este ejemplar?')) {
        try {
          const hoy = new Date().toISOString().split('T')[0]
          
          // Actualizar préstamo
          await this.axios.patch(`/prestamos/${item.id}`, {
            estado: 'devuelto',
            fecha_devolucion_real: hoy
          })
          
          // Actualizar estado del ejemplar
          await this.axios.patch(`/ejemplares/${item.ejemplarId}`, {
            estado: 'disponible'
          })
          
          this.obtenerLista()
          this.obtenerEjemplares()
        } catch (error) {
          console.error('Error registrando devolución:', error)
        }
      }
    }
  }
}
</script>