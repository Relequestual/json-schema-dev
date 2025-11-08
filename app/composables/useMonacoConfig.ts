// Shared Monaco Editor configuration and setup
// Provides JSON Schema validation, themes, and language features

export const useMonacoConfig = () => {
  // Configure basic JSON syntax validation only
  const configureJsonSyntaxOnly = async () => {
    const monaco = await useMonaco();
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

  // No-op function for compatibility (schema validation handled externally)
  const updateInstanceSchema = async (schema: string) => {
    // Schema validation is handled by external validation system
    return true;
  };

  // Common editor options
  const getEditorOptions = (isDarkMode = true) => ({
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    theme: isDarkMode ? 'vs-dark' : 'vs',
  });

  return {
    configureSchemaEditor,
    configureInstanceEditor,
    updateInstanceSchema,
    getEditorOptions,
  };
};
