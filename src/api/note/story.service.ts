import axios from 'axios';

import { BASEURL } from '..';
import { IAddCategory } from '../../interface/note.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Category
export const getCategoryApi = (id: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/categories/${id}`, {
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

// Get Categories
export const getCategoriesApi = (callBack: ApiFunction) => {
   let url = `${BASEURL}/categories`;

   axios
      .get(url, {
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

// Add Category
export const addCategoryApi = (data: IAddCategory, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/categories`, data, {
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

// Edit Category
export const editCategoryApi = (
   categoryId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/categories/${categoryId}`, formData, {
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

// Delete Category
export const deleteCategoryApi = (categoryId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/categories/${categoryId}`, {
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

// Add Sentence to Category
export const addSentenceToCategoryApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/categories/add-sentence`, data, {
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

// Delete Sentence to Category
export const deleteSentenceOfCategoryApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/categories/delete-sentence`, data, {
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

// sync category audio
export const syncCategoryAudioApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/categories/sync-category-audio`, data, {
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
