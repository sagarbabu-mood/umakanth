import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import News from './components/News';
import Signup from './components/Signup';
import NotFound from './components/NotFound'; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
