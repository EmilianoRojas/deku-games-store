import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Games from './pages/Games';
import GamePacks from './pages/GamePacks';
import DLCs from './pages/DLCs';
import FAQ from './pages/FAQ';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-['Nintendo_Switch_UI',_Roboto,_Helvetica,_Arial,_sans-serif]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game-packs" element={<GamePacks />} />
            <Route path="/dlcs" element={<DLCs />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;