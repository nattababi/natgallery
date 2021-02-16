import React from 'react';
import Form from './form';

class RegisterForm extends Form {
  state = {

  };

  selected = [];

  filterHandler = (evt) => {

    let checked = evt.target.checked;
    let name = evt.target.name;

    if (checked) {
      this.selected.push(name);
    }
    else {
      this.selected.splice(this.selected.indexOf(name), 1);
    }

    console.log(this.selected.join(","));
  }

  doSubmit = async () => {
    console.log('do submit');

    console.log(this.selected.join(","));

    window.location = "/albumDetails?keyword=" + this.selected.join(",");
  }

  render() {

    const myimages = [
      {imageId: "AAcw7hb2DsGd6ATFuDNcAYHtNkWgS5rgpFw0Ys0aLysOuEhdRRuIJEwvPbSXbFtDHgM2_cMKhAHy4IInEfOXnE0CIQbljhhqXA",
        baseUrl: "https://lh3.googleusercontent.com/lr/AFBm1_YgCUfaPo0SyMpxVlgpKBc-8xjUkrs7acLzBjODr-coKgkTomKI-xK2QcYYPlQpsC5tggkgiYXKrXkVv02EmgB_tPEqk0ryZmfEXg6mUlCiCxkbgyLSPi4BEWb7-FGu4ZzB39fP8FkTIpeb4WLJn1iBE4_5wBUQITbf1aH2slz8IuaFrPzrdXG1OAvhd9pUW0oHgMc6QBStgFbw80sf8NgY0BndyM-pqHWC8FiksEqRG1XB-Z3qWHlr-N-8uy0AU68_8ocZd3cbVhm1YLTT8UqxTLEl8WTRtHO6syAMRYOTFxfmqAnwMdzjffS7E8R2DUlxnN2C7suPYcRHt_b8Ak9WkPhe6bCLNbFnCUPw_aaOFP5CB584xpz42V9dxD8oK3Hw_13oGHStbPXGtc6x3plmz9TW21vj0lSw6dEJWdueseQi4Lr9qWGJ_YttomnaN_2kfmubS6zUmZNXQcI55YMQoDvPnC3DdfeuBpru3HRqeBOkg35Jk9xU64VTNJieOEbVYBeVx3bcHZwS6YP7ykJOyo9J4GrUKQrM9zlr_QuSflNS9IAGzCnBkl9JHUiVrh9lp8kXFl3IWlRR7fdQZ100mAPwXpmOCgoAIYkMkUzSsT7EwDqhf8zAKbT2o_QLAZwxknFhrfOtu9pzN8h5LXDvv6rnyFjiz46Gz3ISGkcfcUaMVARep0lIJkw10D8ICs8VBQilYL7KzI1DY1E5N5IOR-svsWukrVey6ktrnNbjCdbvEcLSHVgAcmeBUwwv--8V8aL87vSu5SHd8VtNQ71geTEJF7KpgTgsPG1Kb6meqIPvchcucKLWzRNH",
        mimeType: "image/jpeg",
        mediaMetadata: {
          height : "4032",
          width: "3024",
        }},
        {imageId: "AAcw7hackzVM4XQCp7-LbkMXU0d7r1Z7G9XzShxvWQwIlQrI0TM-kZyi85iUY_H7RjpdqxPFs2Hpo6aBqs2-fyUKVY_jCGU40w",
        baseUrl: "https://lh3.googleusercontent.com/lr/AFBm1_bRzyYl-UEtDIHZeZfTGGswLnC1KA9AqNCU8PInC2JXaesJTw0sBodpM3pw4LbBszsfA0oDmz-oMGiyWnBj-s9rhM1x8Ed-xG6H2pnlQbEu9yXLKqXI0px-lx2TFbciQqngA0JKTXhcXQckObyWavfIqa2iKy759bmMMk4TbdKU4yO3IlXijW4XYP87CKR509GBDOz9xrTm6OAbUqNtdZcRFcwnvGWEoO3rDuMBdHb7LzCu8s8-XGTt9ud_KXybsMURhwbayXpil1r37t0Ic5EvJa9rMuCj-M1L8fE7ZUO-994vkj7DQLD-LYJi6450oEqthhgDBnPd5FxomgLavjVALi2f2J8DcdMIH8BeWIsjKhQKBsm3c0B2Y9VhCpaFwrVpWIVK21q2nBvVmGeysS5BKckAWvYeghRF3gLkdLWTwavo0UuxtmQ4tX0O3vZ1mut5cpZXt5s35fuUouBERi0mnOpsAmGn4PrGxkd6a14kMCozf9tB4k_lInUbLstyd7YauvIeAdSRSoCXo0mdZP7Q7eZ0xokiXnytmngr3o8Zebs942MPSxp5cSp0a8uzjwCMDlZin0ETe9qlWiIoKPkQRXQiXUt5U7aWRapNYuGRgdYJL6UjiMvN8hSUpr3wpmYVqAL8x0i5KB0EiLDDe6osNh6sC5SDKTZZ4g8DoDJ6loHWzt8-5lsAqlxI7wnzNgx2lfVFHlb23_eAfR9s0J8WB2UZUs356mgdldBsXX5uzsb5um3RWWDKd6TDEdqyjQKnonAqCWShphGQ7-0oVywN8EJdcxcBWe2cf46GmpnClPEZAkbIt8XHtjJV",
        mimeType: "image/jpeg",
        mediaMetadata: {
          height : "4032",
          width: "3024",
        }}
    ];
    return (<div>
      <form onSubmit={this.handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">

            {this.renderButton("Search")}

            <div className="input-group-text">
              <input type="checkbox" name="nature" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Nature</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="selfies" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Selfies</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="food" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Food</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="weddings" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Weddings</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="sport" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Sport</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="pets" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Pets</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="cityscapes" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Cityscapes</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="nature" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Nature</label>
            </div>

          </div>
          
        </div>
        
      </form>

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

      <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
          <div style={{ backgroundColor: 'black' }} id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval="5000" data-wrap="true" keyboard="true" ride="true">
          
          <div className="carousel-inner" style={{
            backgroundColor: 'red',
          }}
          >
            {myimages.map((item, index, arrayobj) =>
              <div key={item.id + '-wrap'} className={
                (index === 1) ? "carousel-item active" : "carousel-item" }
                style={{
                  backgroundColor: 'black',
                  border: 'solid 1px #000'
                }}
              >
                {item.mimeType.startsWith('image/') ?
                  <div style={{ position: 'relative', textAlign: 'center', }}>
                    <img style={{ height: '630px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                      key={item.id} className="d-block w-800"
                      src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height}
                      alt="Alt slide" />
                  </div> : 
                  <div style={{ position: 'relative', textAlign: 'center', }}>
                    <video style={{ height: '630px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                      key={item.id} className="d-block w-800"
                      src={item.baseUrl+"=dv"} type={item.mimeType} controls autoPlay loop
                      alt="Alt slide" />
                  </div>
                    


                }
                <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '100%', height: '70px', padding: '18px' }}>
                </div>
                <div style={{ position: 'absolute', bottom: '35px', left: '50%', fontSize: '12px', color: '#F0F0F2' }}>{index + 1} &#x2f; {arrayobj.length}</div>
              </div>)}
          </div>

          <a style={{ marginLeft: '0px' }} className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>

        </div>
    </div>
  </div>
</div>

    </div>);
  }
}

export default RegisterForm;

// {"filters":{"contentFilter":{"includedContentCategories":["SELFIES"]},"mediaTypeFilter":{"mediaTypes":["PHOTO"]}}}
// const parameters = {filters};