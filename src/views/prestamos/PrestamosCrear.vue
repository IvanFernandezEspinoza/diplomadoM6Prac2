<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Ejemplar *</label>
      <select v-model="item.ejemplarId" class="form-select" required>
        <option value="">Seleccione un ejemplar</option>
        <option 
          v-for="ejemplar in ejemplares" 
          :key="ejemplar.id" 
          :value="ejemplar.id"
          :disabled="ejemplar.estado !== 'disponible'"
        >
          {{ obtenerDescripcionEjemplar(ejemplar) }}
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
      default: () => [],
      required: true
    },
    usuarios: {
      type: Array,
      default: () => [],
      required: true
    },
    encargados: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      item: {
        ejemplarId: '',
        usuarioId: '',
        encargadoId: '',
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_devolucion_estimada: this.calcularFechaDevolucion(15),
        observaciones: '',
        estado: 'activo'
      }
    }
  },
  methods: {
    calcularFechaDevolucion(dias) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() + dias)
      return fecha.toISOString().split('T')[0]
    },
    obtenerDescripcionEjemplar(ejemplar) {
      if (!ejemplar) return 'Ejemplar no disponible'
      
      if (ejemplar.libro) {
        return `${ejemplar.codigo} - ${ejemplar.libro.titulo} (${ejemplar.estado})`
      }
      
      return `${ejemplar.codigo} (${ejemplar.estado})`
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