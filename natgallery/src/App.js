import logo from './logo.svg';
import './App.css';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import { Route, useLocation } from 'react-router-dom';

import Navbar from './components/navbar';
import Albums from './components/albums';
import AlbumDetails from './components/albumDetails';
import searchForm from './components/searchForm';
import Carousel from './components/carousel';
import Intro from './components/intro';

function App() {
  
  return (
    <div>
      <Provider {...stores}>


      {useLocation().pathname !== '/' && <Navbar />}

        <div>
          <Route path="/albums" component={Albums} />
          <Route path="/albumdetails" component={AlbumDetails} />
          <Route path="/search" component={searchForm} />
          <Route path="/carousel" component={Carousel} />
          <Route path="/" exact component={Intro} />
        </div>

      </Provider>
    </div>
  );
}

export default App;
