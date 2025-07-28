<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Nombre *</label>
      <input v-model="item.nombre" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Email *</label>
      <input v-model="item.email" type="email" class="form-control" required>
      <div class="invalid-feedback">Email válido requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Rol *</label>
      <select v-model="item.rol" class="form-select" required>
        <option value="">Seleccione...</option>
        <option value="administrador">Administrador</option>
        <option value="encargado">Encargado</option>
      </select>
      <div class="invalid-feedback">Seleccione un rol</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Contraseña *</label>
      <input v-model="item.password" type="password" class="form-control" required>
      <div class="invalid-feedback">Contraseña requerida</div>
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EncargadosCrear',
  data() {
    return {
      item: {
        nombre: '',
        email: '',
        rol: '',
        password: ''
      }
    }
  },
  methods: {
    emitir(event) {
      const form = event.target
      if (!form.checkValidity()) {
        form.classList.add('was-validated')
        return
      }
      this.$emit('created', this.item)
    }
  }
}
</script>