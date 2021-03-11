import React, { useEffect } from 'react';
import Album from './album';
import LoadingOverlay from 'react-loading-overlay';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/albumStore';

const Albums = observer(() => {

  const store = useStore();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchData() {
      await store.cacheAlbums();
  }
  fetchData();
}, [store]);

  if (!store.albums) {
    return (
      <div>
        <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{ border: '3px solid #fff', height: '70px', textAlign: 'left' }}>
              <div style={{marginTop: '18px'}}>
                Loading albums...
              </div>
            </div>
        </LoadingOverlay>
      </div>);
  }

  if (store.albums.length < 1) {
    return (<div>Server error or no albums found. Please, refresh the page</div>);
  }
     
  return (
    <div style={{}}>
      {store.albums.map(item =>
        <Album key={item.id}
          albumId={item.id}
          albumTitle={item.title}
          coverUrl={item.coverPhotoBaseUrl}
          mediaItemsCount={item.mediaItemsCount}
          saveDate={item.saveDate} />
      )}
    </div>
  );
});

export default Albums;