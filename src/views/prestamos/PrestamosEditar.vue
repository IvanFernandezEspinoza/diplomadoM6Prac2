<template>
  <form @submit.prevent="emitir($event)" novalidate>
    <div class="mb-3">
      <label class="form-label">Ejemplar *</label>
      <select v-model="itemLocal.ejemplarId" class="form-select" required>
        <option value="">Seleccione un ejemplar...</option>
        <option v-for="ejemplar in ejemplares" :key="ejemplar.id" :value="ejemplar.id">
          {{ ejemplar.codigo }} - {{ ejemplar.libro?.titulo || 'Desconocido' }}
        </option>
      </select>
      <div class="invalid-feedback">Seleccione un ejemplar</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Usuario *</label>
      <select v-model="itemLocal.usuarioId" class="form-select" required>
        <option value="">Seleccione un usuario...</option>
        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
          {{ usuario.nombre }} - {{ usuario.email }}
        </option>
      </select>
      <div class="invalid-feedback">Seleccione un usuario</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha de Préstamo *</label>
      <input v-model="itemLocal.fecha_prestamo" type="date" class="form-control" required>
      <div class="invalid-feedback">Seleccione una fecha</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha de Devolución Estimada *</label>
      <input v-model="itemLocal.fecha_devolucion_estimada" type="date" class="form-control" required>
      <div class="invalid-feedback">Seleccione una fecha</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Estado *</label>
      <select v-model="itemLocal.estado" class="form-select" required>
        <option value="activo">Activo</option>
        <option value="devuelto">Devuelto</option>
        <option value="vencido">Vencido</option>
      </select>
      <div class="invalid-feedback">Seleccione un estado</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha de Devolución Real</label>
      <input v-model="itemLocal.fecha_devolucion_real" type="date" class="form-control">
    </div>

    <div class="mb-3">
      <label class="form-label">Observaciones</label>
      <textarea v-model="itemLocal.observaciones" class="form-control"></textarea>
    </div>

    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PrestamosEditar',
  props: {
    item: {
      type: Object,
      required: true
    },
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