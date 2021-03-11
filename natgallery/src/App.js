import './App.css';
import { Route, useLocation } from 'react-router-dom';

import Navbar from './components/navbar';
import Albums from './components/albums';
import AlbumDetails from './components/albumDetails';
import searchForm from './components/searchForm';
import Carousel from './components/carousel';
import Intro from './components/intro';
import { AlbumStore, StoreProvider } from './stores/albumStore';

const store = new AlbumStore();

function App() {
  
  return (
    <div>
      <StoreProvider store={store}>

        {useLocation().pathname !== '/' && <Navbar />}

        <div>
          <Route path="/albums" component={Albums} />
          <Route path="/albumdetails" component={AlbumDetails} />
          <Route path="/search" component={searchForm} />
          <Route path="/carousel" component={Carousel} />
          <Route path="/" exact component={Intro} />
        </div>

      </StoreProvider>
    </div>
  );
}

export default App;
