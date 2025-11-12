<script setup lang="ts">
import type * as Monaco from 'monaco-editor';

interface Props {
  modelValue?: string;
  language?: string;
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  options?: Monaco.editor.IStandaloneEditorConstructionOptions;
  containerStyle?: Record<string, string | number>;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
  (event: 'ready', editor: Monaco.editor.IStandaloneCodeEditor): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'json',
  theme: 'vs-dark',
  options: () => ({}),
  containerStyle: () => ({}),
});

const emit = defineEmits<Emits>();

const editorContainer = ref<HTMLElement>();
let editor: Monaco.editor.IStandaloneCodeEditor | null = null;

const colorMode = useColorMode();

// Get theme based on color mode
const editorTheme = computed(() => {
  if (props.theme !== 'vs-dark') return props.theme;
  return colorMode.value === 'dark' ? 'vs-dark' : 'vs';
});

const initializeEditor = async () => {
  if (!editorContainer.value) return;

  try {
    const { useCustomMonaco } = await import('~/composables/useCustomMonaco');
    const monaco = await useCustomMonaco();
    if (!monaco) return;

    // Dispose existing editor
    if (editor) {
      editor.dispose();
    }

    // Get the existing Monaco configuration
    const { useMonacoConfig } = await import('~/composables/useMonacoConfig');
    const { getEditorOptions } = useMonacoConfig();
    const isDarkMode = editorTheme.value === 'vs-dark';
    const baseOptions = getEditorOptions(isDarkMode);

    const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
      value: props.modelValue,
      language: props.language,
      ...baseOptions,
      theme: editorTheme.value, // Override theme from baseOptions
      ...props.options,
    };

    editor = monaco.editor.create(editorContainer.value, editorOptions);

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || '';
      emit('update:modelValue', value);
    });

    // Emit ready event
    if (editor) {
      emit('ready', editor);
    }
  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error);
  }
};

// Watch for external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.getValue() !== newValue) {
      editor.setValue(newValue);
    }
  }
);

// Watch for theme changes
watch(editorTheme, (newTheme) => {
  if (editor) {
    editor.updateOptions({ theme: newTheme });
  }
});

// Initialize on mount
onMounted(() => {
  nextTick(() => {
    initializeEditor();
  });
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
    editor = null;
  }
});
</script>

<template>
  <div
    ref="editorContainer"
    :style="{ width: '100%', height: '100%', ...containerStyle }"
    class="monaco-editor-container"
  />
</template>

<style scoped>
.monaco-editor-container {
  border: 1px solid rgb(229 231 235);
  border-radius: 0.375rem;
  overflow: hidden;
}

.dark .monaco-editor-container {
  border-color: rgb(75 85 99);
}
</style>
