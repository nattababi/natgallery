import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import { Provider } from 'mobx-react';
import * as stores from './stores';

function App() {
  return (
    <div>
      <Provider {...stores}>
        <Navbar />
      </Provider>
    </div>
  );
}

export default App;
