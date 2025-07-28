<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Título *</label>
      <input v-model="item.titulo" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Autor *</label>
      <input v-model="item.autor" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">ISBN *</label>
      <input v-model="item.isbn" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Género *</label>
      <input v-model="item.genero" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Año de publicación *</label>
      <input v-model="item.anio_publicacion" type="number" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Editorial</label>
      <input v-model="item.editorial" type="text" class="form-control">
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'LibrosCrear',
  data() {
    return {
      item: {
        titulo: '',
        autor: '',
        isbn: '',
        genero: '',
        anio_publicacion: '',
        editorial: ''
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