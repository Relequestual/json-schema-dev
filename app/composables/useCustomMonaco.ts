// Custom Monaco Editor composable for minimal JSON-only setup
import type * as Monaco from 'monaco-editor';

let monaco: typeof Monaco | null = null;
let monacoPromise: Promise<typeof Monaco> | null = null;

export const useCustomMonaco = () => {
  if (import.meta.server) {
    return Promise.resolve(null);
  }

  if (monaco) {
    return Promise.resolve(monaco);
  }

  if (!monacoPromise) {
    monacoPromise = loadMonaco();
  }

  return monacoPromise;
};

async function loadMonaco(): Promise<typeof Monaco> {
  try {
    // Import Monaco Editor - this will include JSON support by default
    const monacoModule = await import('monaco-editor');

    // Use the existing Monaco configuration from useMonacoConfig
    const { useMonacoConfig } = await import('./useMonacoConfig');
    const { configureSchemaEditor, configureInstanceEditor } = useMonacoConfig();
    await configureSchemaEditor();
    await configureInstanceEditor();

    monaco = monacoModule;
    return monacoModule;
  } catch (error) {
    console.error('Failed to load Monaco Editor:', error);
    throw error;
  }
}

export const createMonacoEditor = async (
  container: HTMLElement,
  options: Monaco.editor.IStandaloneEditorConstructionOptions = {}
) => {
  const monacoInstance = await useCustomMonaco();
  if (!monacoInstance) throw new Error('Monaco Editor not available on server');

  const defaultOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
    language: 'json',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    tabSize: 2,
    insertSpaces: true,
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoSurround: 'languageDefined',
  };

  return monacoInstance.editor.create(container, {
    ...defaultOptions,
    ...options,
  });
};
