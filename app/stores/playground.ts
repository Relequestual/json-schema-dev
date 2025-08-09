// Main playground state store
// Manages JSON Schema and instance data, loading states, and core application state

import { defineStore } from 'pinia'

export const usePlaygroundStore = defineStore('playground', () => {
  // Core content state
  const schema = ref('')
  const instance = ref('')
  
  // UI state
  const isLoading = ref(false)
  const showFeatures = ref(false)
  const showSettings = ref(false)
  
  // Actions
  const setSchema = (newSchema: string) => {
    schema.value = newSchema
  }
  
  const setInstance = (newInstance: string) => {
    instance.value = newInstance
  }
  
  const toggleFeatures = () => {
    showFeatures.value = !showFeatures.value
  }
  
  const toggleSettings = () => {
    showSettings.value = !showSettings.value
  }
  
  // Initialize with default values
  const initialize = () => {
    schema.value = '{\n\n}'
    instance.value = '{\n\n}'
  }
  
  return {
    // State
    schema,
    instance,
    isLoading,
    showFeatures,
    showSettings,
    
    // Actions
    setSchema,
    setInstance,
    toggleFeatures,
    toggleSettings,
    initialize
  }
})
