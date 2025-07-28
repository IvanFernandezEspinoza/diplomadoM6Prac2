<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Libro *</label>
      <select v-model="item.libroId" class="form-select" required @change="validarEjemplar">
        <option value="">Seleccione un libro...</option>
        <option v-for="libro in libros" :key="libro.id" :value="libro.id">
          {{ libro.titulo }} ({{ libro.autor }})
        </option>
      </select>
      <div class="invalid-feedback">Seleccione un libro</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Código *</label>
      <input v-model="item.codigo" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Estado *</label>
      <select v-model="item.estado" class="form-select" required>
        <option value="">Seleccione...</option>
        <option value="disponible">Disponible</option>
        <option value="prestado">Prestado</option>
        <option value="mantenimiento">En mantenimiento</option>
      </select>
      <div class="invalid-feedback">Seleccione un estado</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Ubicación *</label>
      <input v-model="item.ubicacion" type="text" class="form-control" required>
      <div class="invalid-feedback">Campo requerido</div>
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EjemplaresCrear',
  props: {
    libros: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      item: {
        libroId: '',
        codigo: '',
        estado: 'disponible', // Valor por defecto
        ubicacion: ''
      }
    }
  },
  methods: {
    validarEjemplar() {
      // Puedes agregar validaciones adicionales aquí si necesitas
      console.log('Libro seleccionado:', this.item.libroId);
    },
    emitir(event) {
      const form = event.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      
      // Emitir el evento con los datos limpios
      this.$emit('created', {
        ...this.item,
        codigo: this.item.codigo.trim(),
        ubicacion: this.item.ubicacion.trim()
      });
      
      // Resetear el formulario después de emitir
      this.resetForm();
    },
    resetForm() {
      this.item = {
        libroId: '',
        codigo: '',
        estado: 'disponible',
        ubicacion: ''
      };
    }
  }
}
</script>