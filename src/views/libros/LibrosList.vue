<template>
  <div>
    <h1>Libros</h1>
    <button type="button" class="btn btn-primary mb-3" @click="abrirModalParaCrear()">
      Nuevo Libro
    </button>
    
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>Año</th>
            <th>ISBN</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.titulo }}</td>
            <td>{{ item.autor }}</td>
            <td>{{ item.genero }}</td>
            <td>{{ item.anio_publicacion }}</td>
            <td>{{ item.isbn }}</td>
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
    <div class="modal fade" id="libroModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <LibrosCrear v-if="modalMode === 'crear'" @created="nuevo($event)" />
            <LibrosEditar v-if="modalMode === 'editar'" :item="itemSeleccionado" @updated="modificar($event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import LibrosCrear from './LibrosCrear.vue'
import LibrosEditar from './LibrosEditar.vue'

export default {
  name: 'LibrosList',
  components: {
    LibrosCrear,
    LibrosEditar
  },
  data() {
    return {
      items: [],
      modal: null,
      modalMode: 'crear',
      modalTitle: 'Nuevo Libro',
      itemSeleccionado: null
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modalRef)
    this.obtenerLista()
  },
  methods: {
    async obtenerLista() {
      try {
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/libros`);
  this.items = response.data;
      } catch (error) {
        console.error('Error obteniendo libros:', error)
      }
    },
    abrirModalParaCrear() {
      this.modalMode = 'crear'
      this.modalTitle = 'Nuevo Libro'
      this.modal.show()
    },
    abrirModalParaEditar(item) {
      this.modalMode = 'editar'
      this.modalTitle = 'Editar Libro'
      this.itemSeleccionado = { ...item }
      this.modal.show()
    },
    cerrarModal() {
      this.modal.hide()
    },
    async nuevo(item) {
      try {
        await this.axios.post('/libros', item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error creando libro:', error)
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`/libros/${item.id}`, item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error actualizando libro:', error)
      }
    },
    async eliminar(item) {
      if (confirm(`¿Está seguro de eliminar el libro "${item.titulo}"?`)) {
        try {
          await this.axios.delete(`/libros/${item.id}`)
          this.obtenerLista()
        } catch (error) {
          console.error('Error eliminando libro:', error)
        }
      }
    }
  }
}
</script>