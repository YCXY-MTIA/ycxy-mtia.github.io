import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Activities from './components/Activities';
import JoinUs from './components/JoinUs';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <Activities />
        <JoinUs />
      </main>
    </div>
  );
}
