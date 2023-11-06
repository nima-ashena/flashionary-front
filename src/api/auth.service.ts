import axios from 'axios';
import { BASEURL } from '.';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

export const getUserApi = (callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/users/get-user`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

export const getUsersApi = (callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/users`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

export const signInApi = (user: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/users/sign-in`, user)
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// Edit User
export const editUserApi = (
   userId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/users/${userId}`, formData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};
