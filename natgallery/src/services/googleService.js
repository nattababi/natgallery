import axios from "axios";

//axios.defaults.baseURL = process.env.TEACHER_API_URL;
//let TEACHER_API_URL = "https://polite-sorry-98582.herokuapp.com/api/";
let GOOGLE_API_URL = "http://localhost:8080/";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    //logger.log(error);
    //toast.error("An unexpected error occurrred.");
  }
  return Promise.reject(error);
});

export async function getAlbums() {
  console.log(GOOGLE_API_URL + "getAlbums/");
  const { data } = await axios.get(GOOGLE_API_URL + "getAlbums/");

  console.log(data.sharedAlbums);
  return data.sharedAlbums;
}

export async function getAlbum(id) {
  const { data } = await axios.post(GOOGLE_API_URL + "loadFromAlbum/" + id);
  console.log("await return from axios", data.photos);
  return data.photos;
}

export async function getSearch(keyword) {
  //const { photos } = await axios.post(GOOGLE_API_URL + "loadFromSearch/");

  //let arrCategs = ['selfies','food'];
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

