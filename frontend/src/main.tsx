import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import App from './App'
import { DataProvider } from './app/DataProvider'
import { dataSource } from './app/dataSource'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider source={dataSource}>
      <App />
    </DataProvider>
  </StrictMode>,
)
