import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'
function App() {
  return (
    <div className="App">
    <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
    </div>
  );
}

export default App;
