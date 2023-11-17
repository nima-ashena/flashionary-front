import axios from 'axios';

import { BASEURL } from '.';
import { IAddVocabGroup } from '../interface/vocabGroup.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get VocabGroup
export const getVocabGroupApi = (id: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/vocab-groups/${id}`, {
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

// Get Stories
export const getVocabGroupsApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/vocab-groups`;
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

// Add VocabGroup
export const addVocabGroupApi = (data: IAddVocabGroup, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocab-groups`, data, {
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

// Edit VocabGroup
export const editVocabGroupApi = (
   vocabGroupId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/vocab-groups/${vocabGroupId}`, formData, {
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

// Delete VocabGroup
export const deleteVocabGroupApi = (vocabGroupId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/vocab-groups/${vocabGroupId}`, {
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

// Add Vocab to VocabGroup
export const addVocabToVocabGroupApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocab-groups/add-vocab`, data, {
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

// Delete Vocab to VocabGroup
export const deleteVocabOfVocabGroupApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/vocab-groups/delete-vocab`, data, {
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

// sync vocabGroup audio
export const syncVocabGroupAudioApi = (vocabGroupId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/Stories/sync-vocabGroup-audio/${vocabGroupId}`,
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
