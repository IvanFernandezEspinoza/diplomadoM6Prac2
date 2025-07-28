<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Nombre *</label>
      <input v-model="itemLocal.nombre" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Email *</label>
      <input v-model="itemLocal.email" type="email" class="form-control" required>
      <div class="invalid-feedback">Email válido requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Rol *</label>
      <select v-model="itemLocal.rol" class="form-select" required>
        <option value="">Seleccione...</option>
        <option value="administrador">Administrador</option>
        <option value="encargado">Encargado</option>
      </select>
      <div class="invalid-feedback">Seleccione un rol</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Contraseña</label>
      <input v-model="itemLocal.password" type="password" class="form-control" placeholder="Dejar en blanco para no cambiar">
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EncargadosEditar',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      itemLocal: { ...this.item }
    }
  },
  methods: {
    emitir(event) {
      const form = event.target
      if (!form.checkValidity()) {
        form.classList.add('was-validated')
        return
      }
      
      // Si no se cambió la contraseña, no la enviamos
      const itemToEmit = { ...this.itemLocal }
      if (!itemToEmit.password) {
        delete itemToEmit.password
      }
      
      this.$emit('updated', itemToEmit)
    }
  }
}
</script>