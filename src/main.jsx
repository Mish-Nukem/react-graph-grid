import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DebugApp from './Tests/DebugApp.jsx'
import './css/default.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <DebugApp />
    </StrictMode>,
)
