<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Título *</label>
      <input v-model="itemLocal.titulo" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Autor *</label>
      <input v-model="itemLocal.autor" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">ISBN *</label>
      <input v-model="itemLocal.isbn" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Género *</label>
      <input v-model="itemLocal.genero" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Año de publicación *</label>
      <input v-model="itemLocal.anio_publicacion" type="number" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Editorial</label>
      <input v-model="itemLocal.editorial" type="text" class="form-control">
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'LibrosEditar',
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