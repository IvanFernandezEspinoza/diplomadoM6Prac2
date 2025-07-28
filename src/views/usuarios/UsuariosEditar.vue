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
      <label class="form-label">Teléfono *</label>
      <input v-model="itemLocal.telefono" type="tel" class="form-control" required>
      <div class="invalid-feedback">Teléfono requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Dirección *</label>
      <input v-model="itemLocal.direccion" type="text" class="form-control" required>
      <div class="invalid-feedback">Dirección requerida</div>
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UsuariosEditar',
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
      this.$emit('updated', this.itemLocal)
    }
  }
}
</script>