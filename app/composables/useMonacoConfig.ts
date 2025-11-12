// Shared Monaco Editor configuration and setup
// Provides JSON Schema validation, themes, and language features

export const useMonacoConfig = () => {
  // Configure basic JSON syntax validation only
  const configureJsonSyntaxOnly = async () => {
    const monaco = await import('monaco-editor');
    if (!monaco) return false;

    // Configure JSON language to only validate syntax, not schema
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true, // Keep basic JSON syntax validation
      allowComments: false,
      schemas: [], // No schema validation
      enableSchemaRequest: false,
      schemaRequest: 'ignore' as const,
      schemaValidation: 'ignore' as const, // Ignore schema validation
      trailingCommas: 'error' as const,
    });
    return true;
  };

  // Configure both editors with syntax-only validation
  const configureSchemaEditor = async () => {
    return configureJsonSyntaxOnly();
  };

  const configureInstanceEditor = async () => {
    return configureJsonSyntaxOnly();
  };

  // Common editor options
  const getEditorOptions = (isDarkMode = true) => ({
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    folding: true,
    theme: isDarkMode ? 'vs-dark' : 'vs',
  });

  return {
    configureSchemaEditor,
    configureInstanceEditor,
    getEditorOptions,
  };
};
