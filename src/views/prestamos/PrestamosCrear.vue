<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Ejemplar *</label>
      <select v-model="item.ejemplarId" class="form-select" required @change="ejemplarSeleccionado">
        <option value="">Seleccione un ejemplar...</option>
        <option v-for="ejemplar in ejemplares" :key="ejemplar.id" :value="ejemplar.id">
          {{ ejemplar.codigo }} - {{ ejemplar.libro.titulo }}
        </option>
      </select>
      <div class="invalid-feedback">Seleccione un ejemplar</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Usuario *</label>
      <select v-model="item.usuarioId" class="form-select" required>
        <option value="">Seleccione un usuario...</option>
        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
          {{ usuario.nombre }} - {{ usuario.email }}
        </option>
      </select>
      <div class="invalid-feedback">Seleccione un usuario</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha de Préstamo *</label>
      <input v-model="item.fecha_prestamo" type="date" class="form-control" required>
      <div class="invalid-feedback">Seleccione una fecha</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha de Devolución Estimada *</label>
      <input v-model="item.fecha_devolucion_estimada" type="date" class="form-control" required>
      <div class="invalid-feedback">Seleccione una fecha</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Observaciones</label>
      <textarea v-model="item.observaciones" class="form-control"></textarea>
    </div>

    <input v-model="item.encargadoId" type="hidden">

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PrestamosCrear',
  props: {
    ejemplares: {
      type: Array,
      required: true
    },
    usuarios: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      item: {
        ejemplarId: '',
        usuarioId: '',
        encargadoId: localStorage.getItem('userId') || '',
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_devolucion_estimada: this.calcularFechaDevolucion(),
        observaciones: '',
        estado: 'activo'
      }
    }
  },
  methods: {
    calcularFechaDevolucion() {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() + 14) // 2 semanas por defecto
      return fecha.toISOString().split('T')[0]
    },
    ejemplarSeleccionado() {
      const ejemplar = this.ejemplares.find(e => e.id == this.item.ejemplarId)
      if (ejemplar && ejemplar.estado !== 'disponible') {
        alert('Este ejemplar no está disponible para préstamo')
        this.item.ejemplarId = ''
      }
    },
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