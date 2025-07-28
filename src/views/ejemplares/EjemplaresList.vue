<template>
  <div>
    <h1>Ejemplares</h1>
    <button type="button" class="btn btn-primary mb-3" @click="abrirModalParaCrear()">
      Nuevo Ejemplar
    </button>
    
    <div class="mb-3">
      <div class="input-group">
        <span class="input-group-text">Filtrar por libro</span>
        <select v-model="libroFiltro" class="form-select" @change="filtrarEjemplares">
          <option value="">Todos</option>
          <option v-for="libro in libros" :key="libro.id" :value="libro.id">
            {{ libro.titulo }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <div class="input-group">
        <span class="input-group-text">Filtrar por estado</span>
        <select v-model="estadoFiltro" class="form-select" @change="filtrarEjemplares">
          <option value="">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="prestado">Prestado</option>
          <option value="mantenimiento">En mantenimiento</option>
        </select>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Libro</th>
            <th>Estado</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsFiltrados" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.codigo }}</td>
            <td>{{ obtenerTituloLibro(item.libroId) }}</td>
            <td>
              <span :class="`badge bg-${obtenerClaseEstado(item.estado)}`">
                {{ item.estado }}
              </span>
            </td>
            <td>{{ item.ubicacion }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="abrirModalParaEditar(item)">
                Editar
              </button>
              <button class="btn btn-sm btn-danger" @click="eliminar(item)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="ejemplarModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <EjemplaresCrear v-if="modalMode === 'crear'" :libros="libros" @created="nuevo($event)" />
            <EjemplaresEditar v-if="modalMode === 'editar'" :item="itemSeleccionado" :libros="libros" @updated="modificar($event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import EjemplaresCrear from './EjemplaresCrear.vue'
import EjemplaresEditar from './EjemplaresEditar.vue'

export default {
  name: 'EjemplaresList',
  components: {
    EjemplaresCrear,
    EjemplaresEditar
  },
  data() {
    return {
      items: [],
      libros: [],
      itemsFiltrados: [],
      libroFiltro: '',
      estadoFiltro: '',
      modal: null,
      modalMode: 'crear',
      modalTitle: 'Nuevo Ejemplar',
      itemSeleccionado: null
    }
  },
  async mounted() {
    this.modal = new Modal(this.$refs.modalRef)
    await this.obtenerLibros()
    this.obtenerLista()
  },
  methods: {
    async obtenerLibros() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/libros`)
        this.libros = response.data
      } catch (error) {
        console.error('Error obteniendo libros:', error)
      }
    },
    async obtenerLista() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/ejemplares`)
        this.items = response.data
        this.itemsFiltrados = [...this.items]
      } catch (error) {
        console.error('Error obteniendo ejemplares:', error)
      }
    },
    filtrarEjemplares() {
      this.itemsFiltrados = this.items.filter(item => {
        const cumpleLibro = this.libroFiltro === '' || item.libroId == this.libroFiltro
        const cumpleEstado = this.estadoFiltro === '' || item.estado === this.estadoFiltro
        return cumpleLibro && cumpleEstado
      })
    },
    obtenerTituloLibro(libroId) {
      const libro = this.libros.find(l => l.id == libroId)
      return libro ? libro.titulo : 'Desconocido'
    },
    obtenerClaseEstado(estado) {
      switch (estado) {
        case 'disponible': return 'success'
        case 'prestado': return 'warning'
        case 'mantenimiento': return 'danger'
        default: return 'secondary'
      }
    },
    abrirModalParaCrear() {
      this.modalMode = 'crear'
      this.modalTitle = 'Nuevo Ejemplar'
      this.modal.show()
    },
    abrirModalParaEditar(item) {
      this.modalMode = 'editar'
      this.modalTitle = 'Editar Ejemplar'
      this.itemSeleccionado = { ...item }
      this.modal.show()
    },
    cerrarModal() {
      this.modal.hide()
    },
    async nuevo(item) {
      try {
        await this.axios.post('/ejemplares', item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error creando ejemplar:', error)
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`/ejemplares/${item.id}`, item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error actualizando ejemplar:', error)
      }
    },
    async eliminar(item) {
      if (confirm(`¿Está seguro de eliminar el ejemplar ${item.codigo}?`)) {
        try {
          await this.axios.delete(`/ejemplares/${item.id}`)
          this.obtenerLista()
        } catch (error) {
          console.error('Error eliminando ejemplar:', error)
        }
      }
    }
  }
}
</script>