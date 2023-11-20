import axios from 'axios';

import { BASEURL } from '.';
import { IAddSentence } from '../interface/sentence.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Sentence
export const getSentenceApi = (id: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/sentences/${id}`, {
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

// Get Sentences
export const getSentencesApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/sentences`;
   if (filters?.length)
      for (let i = 0; i < filters?.length; i++) {
         if (i === 0) url += `?${filters[i].name}=${filters[i].value}`;
         else url += `&${filters[i].name}=${filters[i].value}`;
      }

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

// Add Sentence
export const addSentenceApi = (data: IAddSentence, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/sentences`, data, {
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

// Edit Sentence
export const editSentenceApi = (
   sentenceId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/sentences/${sentenceId}`, formData, {
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

// Delete Sentence
export const deleteSentenceApi = (sentenceId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/sentences/${sentenceId}`, {
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

// plus true guess Sentence
export const plusTrueSentenceApi = (sentenceId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/sentences/plus-true-guess/${sentenceId}`,
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

// sync sentence audio
export const syncSentenceAudioApi = (
   data: any,
   callBack: ApiFunction,
) => {
   axios
      .post(
         `${BASEURL}/sentences/sync-sentence-audio`,
         data,
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

// Clone vocab
export const cloneSentenceApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/sentences/clone`, data, {
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
