import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {HashRouter,Routes,Route} from "react-router-dom";
import LoginPage from './components/LoginPage';
import About from './components/About';
import Navbar from './components/Navbar';
import Foot from './components/foot';
import Home from './components/Home';
import VoterHome from './components/VoterHome';
import RegistrationPage from './components/RegistrationPage';
import AdminHome from './components/AdminHome';

function App() {
  return (
    <div class=''>
      <HashRouter>
          <Routes>
            <Route path='/about' element={<About/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/foot' element={<Foot/>}/>
            <Route path='/navbar' element={<Navbar/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/voter-home" element={<VoterHome/>} />
            <Route path="/admin-home" element={<AdminHome/>} />
          </Routes>
      </HashRouter>
    </div>
  );
}

export default App;