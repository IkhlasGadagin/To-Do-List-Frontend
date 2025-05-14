import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, removeToken } from './LocalStorageServices'; // Assuming you have setToken to store new tokens
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
const Verify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [verification, setVerification] = useState({});
  const { access_token, refresh_token } = getToken();
  const navigate = useNavigate();
  const createToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
        refresh: refresh_token
      });
      const data = response.data;
      setVerification(data);

      // Save the new tokens to local storage (assuming response has new tokens)
      localStorage.removeItem('access_token', access_token);
      localStorage.setItem('access_token', data.access);
      window.location.reload();
      // Retry verifying the new access token
      tokenVerify(data.access);
    } catch (error) {
      const data = error.response.data;
      setVerification(data);

      console.error('Error creating new token ', error);
      removeToken();
      localStorage.removeItem('user');
      navigate('/');

      enqueueSnackbar('seesion expired ! please login again', { variant: 'error' });
    }
  };

  const tokenVerify = async (token) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/verify/`, {
        token: token || access_token
      });
      const data = response.data;
      setVerification(data);
    } catch (error) {
      const data = error?.response?.data;
      console.log(data);
      console.error('Error verifying token ', error);
      setVerification(data);

      if (data?.code === 'token_not_valid') {
        createToken();
      }
    }
  };

  useEffect(() => {
    tokenVerify();
  }, []); // Dependency array is empty, so this runs only once when the component mounts

  if (verification?.code === 'token_not_valid') {
    console.log('token_not_valid');
  }
  return null; // or <></>, or any other JSX you want to render
};

export default Verify;
