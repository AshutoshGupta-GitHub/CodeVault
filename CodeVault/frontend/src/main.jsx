
// Gemini code
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import BrowserRouter
import { AuthProvider } from './authContext.jsx';
import ProjectRoutes from './Routes.jsx';
import './index.css'; // (Keep your styles if you have them)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ 1. Add Router here */}
      <AuthProvider>
        {/* ❌ REMOVED <Route> wrapper - it was causing the error */}
        <ProjectRoutes /> 
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);


