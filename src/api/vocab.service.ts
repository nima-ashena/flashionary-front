import axios from 'axios';

import { BASEURL } from '.';
import { IAddVocab } from '../interface/vocab.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Vocab
export const getVocabApi = (id: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/vocabs/${id}`, {
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

// Get Vocabs
export const getVocabsApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/vocabs`;
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

// Add Vocab
export const addVocabApi = (data: IAddVocab, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocabs`, data, {
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

// Edit Vocab
export const editVocabApi = (
   vocabId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/vocabs/${vocabId}`, formData, {
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

// Delete Vocab
export const deleteVocabApi = (vocabId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/vocabs/${vocabId}`, {
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

// plus true guess Vocab
export const plusTrueVocabApi = (vocabId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/vocabs/plus-true-guess/${vocabId}`,
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

// sync vocab audio
export const syncVocabAudioApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocabs/sync-vocab-audio`, data, {
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

// Add Sentence to vocab
export const addSentenceToVocabApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocabs/add-sentence`, data, {
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

// Clone vocab
export const cloneVocabApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocabs/clone`, data, {
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

// Delete Sentence to Vocab
export const deleteSentenceOfVocabApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocabs/delete-sentence`, data, {
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
