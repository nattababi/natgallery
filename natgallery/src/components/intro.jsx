import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './intro.module.css';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/albumStore';

const Intro = observer(() => {

  const store = useStore();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchData() {
      await store.cacheAlbums();
    }
    fetchData();
  }, [store]);

  return (
    <div>
      <Link to='/albums'>
        <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'column nowrap', overflowX: 'hidden' }}>
          <div className={styles['title']} style={{ marginTop: '200px' }}>
            <div className={styles['gallery']}>
              <ul className={styles['ul']} style={{ width: '180px', height: '160px' }}>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}><div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', color: 'white' }}>Enter enter</div></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
                <li className={styles['li']} style={{ backgroundImage: 'url(Logo.png)', width: '180px', height: '160px' }}></li>
              </ul>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
})

export default Intro;