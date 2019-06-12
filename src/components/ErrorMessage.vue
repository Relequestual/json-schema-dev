<template>
  <b-alert
    variant="danger"
    show
    dismissable
  >
    {{ errorMessage }}

    <button
      type="button"
      class="close"
      aria-label="Dismiss"
      @click="dismissError"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </b-alert>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    errorMessage: {
      type: String,
      required: true,
    }
  },
}
</script>
