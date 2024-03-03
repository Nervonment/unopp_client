import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Start from './Start';
import Room from './Room';
import './App.css'
import { ConfigProvider, theme } from 'antd';


function App() {
  return (
    <div className="App">

      <ConfigProvider
        autoInsertSpaceInButton={false}
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#f92667",
            borderRadius: "20px"
          }
        }}
      >
        <Router >
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/room" element={<Room />} />
          </Routes>
        </Router>
      </ConfigProvider>

    </div>
  );
}

export default App;
