import axios from 'axios';
import { BASEURL } from '.';
import { ListGroup } from 'react-bootstrap';

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
   console.log(BASEURL);
   axios
      .post(`${BASEURL}/users/sign-in`, user)
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         console.log(err);
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

//
export const syncAllAudio = (callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/users/sync-all-audio`,
         {},
         {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
            },
         },
      )
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};
