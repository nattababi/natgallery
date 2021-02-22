import axios from "axios";

// axios.defaults.baseURL = process.env.TEACHER_API_URL;
// let TEACHER_API_URL = "https://polite-sorry-98582.herokuapp.com/api/";
// let GOOGLE_API_URL = "http://localhost:8080/";
let GOOGLE_API_URL = "http://192.168.86.92:8080/";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    // toast.error("An unexpected error occurrred.");
  }
  return Promise.reject(error);
});

export async function getAlbums() {
  console.log(GOOGLE_API_URL + "getAlbums/");
  let data = null;

  try {
    data = await axios.get(GOOGLE_API_URL + "getAlbums/");
    data = data.data;
    console.log(data.sharedAlbums);
    return data.sharedAlbums;
  }
  catch (e) {
    console.log('ERROR', e);
    // handle the unsavoriness if needed
    return null;
  }

}

export async function getAlbum(id, pageToken) {

  let data = null;

  try {
    if (pageToken) {
      data = await axios.post(GOOGLE_API_URL + "loadFromAlbum/" + id + '/' + pageToken);
    }
    else {
      data = await axios.post(GOOGLE_API_URL + "loadFromAlbum/" + id + '/0');
    }
    console.log("await return from axios", data.data.photos);
    return { photos: data.data.photos, nextPageToken: data.data.parameters.pageToken };
  }
  catch (e) {
    console.log('ERROR', e);
    // handle the unsavoriness if needed
    return null;
  }

}

export async function getSearch(keyword) {
  //const { photos } = await axios.post(GOOGLE_API_URL + "loadFromSearch/");

  // let arrCategs = ['selfies','food'];
  let arrCategs = keyword.split(",");

  const { data } = await axios({
    method: 'post',
    url: GOOGLE_API_URL + "loadFromSearch/",
    headers: {},
    data: {
      includedCategories: arrCategs, // This is the body part
      excludedCategories: ''
    }
  });

  console.log(data.photos);
  return data.photos;
}