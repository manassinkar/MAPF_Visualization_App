import React from 'react';
/* import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';

const App = () => {
  return (
    <PathfindingVisualizer></PathfindingVisualizer>
  );
}

export default App; */
import './App.css';
import Navbar from './components/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Index';
import About from './pages/About';
import Services from './pages/Service';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Footer from './pages/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
        <Route path='/services' component={Services} />
        <Route path='/contact-us' component={Contact} />
        <Route path='/sign-up' component={SignUp} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
