<template>
  <b-alert
    variant="danger"
    show
    dismissible
  >
    {{ errorMessage }}

    <button
      type="button"
      class="close"
      aria-label="Dismiss"
    />
  </b-alert>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
};
</script>
