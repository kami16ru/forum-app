import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import '@/plugins/firebase'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /App[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // Register component globally
  forumApp.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

forumApp.mount('#app')
