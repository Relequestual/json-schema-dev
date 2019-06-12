<template>
  <div id="results">
    <b-row
      v-if="ajvSchemaError.length !== 0"
      align-h="center"
    >
      <b-col cols="8">
        <b-alert
          show
          variant="danger"
        >
          <h5>Schema Error</h5>
          <code
            v-for="(error, i) in ajvSchemaError"
            :key="i"
            class="text-left"
          >
            <pre>"{{ error.dataPath }}" {{ error.message }} </pre>
          </code>
        </b-alert>
      </b-col>
    </b-row>
    <b-row
      v-if="ajvValidationSuccess === false && ajvValidationErrors.length !== 0"
      align-h="center"
    >
      <b-col cols="8">
        <b-alert
          show
          variant="danger"
        >
          <h5>Validation Error</h5>
          <code
            v-for="error in schemaValidationErrorMessages"
            :key="error"
            class="text-left"
          >
            <pre>{{ error }}</pre>
          </code>
        </b-alert>
      </b-col>
    </b-row>
    <b-row
      v-if="ajvValidationSuccess === true"
      align-h="center"
    >
      <b-col cols="8">
        <b-alert
          show
          variant="success"
        >
          <h5>
            <icon
              v-if="ajvValidationSuccess === true"
              :icon="['far', 'check-circle']"
              size="2x"
              class="align-middle"
            />
            Validation Successful
          </h5>
        </b-alert>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'Results',
  props: {
    ajvValidationSuccess: {
      type: Boolean,
      required: true,
    },
    ajvSchemaError: {
      type: Array,
      default: () => [],
    },
    ajvValidationErrors: {
      type: Array,
      default: () => [],
    },
    schemaValidationErrorMessages: {
      type: Array,
      default: () => [],
    }
  }
}
</script>
