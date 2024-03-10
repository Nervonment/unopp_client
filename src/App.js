import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Start from './Start';
import Room from './Room';
import './App.css'
import { ConfigProvider, theme } from 'antd';
import Login from './Login';
import Register from './Register';
import Self from './Self';
import { themeColor } from './config';


function App() {
  return (
    <div className="App">

      <ConfigProvider
        autoInsertSpaceInButton={false}
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: themeColor,
            borderRadius: "20px"
          }
        }}
      >
        <Router >
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/room" element={<Room />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/me" element={<Self />} />
          </Routes>
        </Router>
      </ConfigProvider>

    </div>
  );
}

export default App;
