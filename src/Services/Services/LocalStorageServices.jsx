// import { jsx } from '@emotion/react';

const storeToken = (value) => {
  if (value) {
    console.log('Store Token', value);
    const { generatedaccessToken, generatedrefreshToken, user } = value;
    localStorage.setItem('access_token', generatedaccessToken);
    localStorage.setItem('refresh_token', generatedrefreshToken);
    localStorage.setItem('user', user);
  }
};

const getToken = () => {
  let access_token = localStorage.getItem('access_token');
  let refresh_token = localStorage.getItem('refresh_token');
  return { access_token, refresh_token };
};

const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export { storeToken, getToken, removeToken };
