import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Viet from './components/viet/Viet';
import Chat from './components/chat/Chat';
function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Viet}></Route>
      <Route path="/chat" component={Chat}></Route>
    </BrowserRouter>
  );
}

export default App;
