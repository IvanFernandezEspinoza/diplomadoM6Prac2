<template>
  <div>
    <h1>Encargados</h1>
    <button type="button" class="btn btn-primary mb-3" @click="abrirModalParaCrear()">
      Nuevo Encargado
    </button>
    
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.rol }}</td>
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
    <div class="modal fade" id="encargadoModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <EncargadosCrear v-if="modalMode === 'crear'" @created="nuevo($event)" />
            <EncargadosEditar v-if="modalMode === 'editar'" :item="itemSeleccionado" @updated="modificar($event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import EncargadosCrear from './EncargadosCrear.vue'
import EncargadosEditar from './EncargadosEditar.vue'

export default {
  name: 'EncargadosList',
  components: {
    EncargadosCrear,
    EncargadosEditar
  },
  data() {
    return {
      items: [],
      modal: null,
      modalMode: 'crear',
      modalTitle: 'Nuevo Encargado',
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
        const response = await this.axios.get('/encargados')
        this.items = response.data
      } catch (error) {
        console.error('Error obteniendo encargados:', error)
      }
    },
    abrirModalParaCrear() {
      this.modalMode = 'crear'
      this.modalTitle = 'Nuevo Encargado'
      this.modal.show()
    },
    abrirModalParaEditar(item) {
      this.modalMode = 'editar'
      this.modalTitle = 'Editar Encargado'
      this.itemSeleccionado = { ...item }
      this.modal.show()
    },
    cerrarModal() {
      this.modal.hide()
    },
    async nuevo(item) {
      try {
        await this.axios.post('/encargados', item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error creando encargado:', error)
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`/encargados/${item.id}`, item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error actualizando encargado:', error)
      }
    },
    async eliminar(item) {
      if (confirm(`¿Está seguro de eliminar al encargado ${item.nombre}?`)) {
        try {
          await this.axios.delete(`/encargados/${item.id}`)
          this.obtenerLista()
        } catch (error) {
          console.error('Error eliminando encargado:', error)
        }
      }
    }
  }
}
</script>