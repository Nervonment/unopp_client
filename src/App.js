import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Start from './Start';
import Room from './Room';
import './App.css'


function App() {
  return (
    <div className="App">
      <Router >
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
