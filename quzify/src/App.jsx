import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Catalog from './pages/Catalog';
import CreateTest from './pages/CreateTest';
import EditTest from './pages/EditTest';
import TakeTest from './pages/TakeTest';
import About from './pages/About';
import MyResults from './pages/MyResults';
import MyTests from './pages/MyTests';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
        <div className="App">
          <Header />
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/test/:id" element={<TakeTest />} />

              <Route path="/create" element={
                <ProtectedRoute><CreateTest /></ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute><EditTest /></ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute><MyResults /></ProtectedRoute>
              } />
              <Route path="/my-tests" element={
                <ProtectedRoute><MyTests /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;