
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from '../src/pages/Signup';
import Login from '../src/pages/Login';
import Dashboard from "./pages/Dashboard";




function App() {

  
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;