<template>
  <div>
    <h1>Usuarios</h1>
    <button type="button" class="btn btn-primary mb-3" @click="abrirModalParaCrear()">
      Nuevo Usuario
    </button>
    
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.telefono }}</td>
            <td>{{ item.direccion }}</td>
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
    <div class="modal fade" id="usuarioModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <UsuariosCrear v-if="modalMode === 'crear'" @created="nuevo($event)" />
            <UsuariosEditar v-if="modalMode === 'editar'" :item="itemSeleccionado" @updated="modificar($event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import UsuariosCrear from './UsuariosCrear.vue'
import UsuariosEditar from './UsuariosEditar.vue'

export default {
  name: 'UsuariosList',
  components: {
    UsuariosCrear,
    UsuariosEditar
  },
  data() {
    return {
      items: [],
      modal: null,
      modalMode: 'crear',
      modalTitle: 'Nuevo Usuario',
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
        const response = await this.axios.get(`${process.env.VUE_APP_API_URL}/usuarios`);
        this.items = response.data;
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
    }
    },
    abrirModalParaCrear() {
      this.modalMode = 'crear'
      this.modalTitle = 'Nuevo Usuario'
      this.modal.show()
    },
    abrirModalParaEditar(item) {
      this.modalMode = 'editar'
      this.modalTitle = 'Editar Usuario'
      this.itemSeleccionado = { ...item }
      this.modal.show()
    },
    cerrarModal() {
      this.modal.hide()
    },
    async nuevo(item) {
      try {
        await this.axios.post('/usuarios', item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error creando usuario:', error)
      }
    },
    async modificar(item) {
      try {
        await this.axios.patch(`/usuarios/${item.id}`, item)
        this.cerrarModal()
        this.obtenerLista()
      } catch (error) {
        console.error('Error actualizando usuario:', error)
      }
    },
    async eliminar(item) {
      if (confirm(`¿Está seguro de eliminar al usuario ${item.nombre}?`)) {
        try {
          await this.axios.delete(`/usuarios/${item.id}`)
          this.obtenerLista()
        } catch (error) {
          console.error('Error eliminando usuario:', error)
        }
      }
    }
  }
}
</script>