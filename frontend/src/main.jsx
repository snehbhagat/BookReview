import { AuthProvider } from '@/context/AuthContext';
import { NytListNamesProvider } from '@/context/NytListNamesContext';
import '@/styles/goodreads.css'; // if previously added
import '@/styles/theme.css'; // ADD: dark/light + skeleton
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // existing tailwind base (if present)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <NytListNamesProvider>
        <App />
      </NytListNamesProvider>
    </AuthProvider>
  </BrowserRouter>
);