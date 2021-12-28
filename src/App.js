import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './components/List/List';
import GetForm from './components/GetForm/GetForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<List></List>}></Route>
        <Route path='/get_form' element={<GetForm></GetForm>}></Route>
        <Route path='/edit/:id' element={<GetForm></GetForm>}></Route>
      </Routes>
    </Router>

  );
}

export default App;
