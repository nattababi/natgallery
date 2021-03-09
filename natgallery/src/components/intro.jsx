import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './intro.module.css';

@inject('albumStore')
@observer
class Intro extends Component {

  async componentDidMount() {
    await this.props.albumStore.cacheAlbums();
  }
  
  render() {
    return (
      <div>
        <Link to='/albums'>
        <div style={{display:'flex',alignItems:'center',flexFlow:'column nowrap',overflowX:'hidden'}}>
          <div className={styles['title']} style={{marginTop: '150px'}}>
            <div className={styles['gallery']}>
            <ul className={styles['ul']} style={{width: '120px', height: '80px'}}>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}><div style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', color: 'white'}}>Enter enter</div></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
                <li className={styles['li']} style={{backgroundImage: 'url(Logo.png)', width: '120px', height: '80px'}}></li>
              </ul>
                {/* <div className={styles['img-card']} style={{backgroundImage: 'url(Logo.png)'}}> */}

                {/* </div> */}
              </div>
            </div>
          </div>
          
          {/* <img className="" src='Logo.png' style={{maxWidth:'100%'}} alt="logo"/> */}
        </Link>
      </div>
    );
  }
}

export default Intro;