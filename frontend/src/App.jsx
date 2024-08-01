import './App.css'
import axios from 'axios'
import {Route, Routes} from "react-router-dom";
import Layout from './Layout.jsx';
import Start from "./pages/Start.jsx";
import ChatWindow from './pages/ChatWindow.jsx';


// axios.defaults.baseURL = "http://localhost:8000";

axios.defaults.baseURL = "https://chatbot-9yzr.onrender.com";
axios.defaults.withCredentials = true;


function App() {
  return(
    <Routes>
      <Route path='/' element={<Layout />}> 
        <Route index element={<Start />} />
        <Route path = "/chatWindow" element={<ChatWindow />} />
      </Route>
    </Routes>
  )
}
export default App
