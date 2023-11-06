import axios from 'axios';

import { BASEURL } from '.';
import { IAddStory } from '../interface/story.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Story
export const getStoryApi = (id: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/stories/${id}`, {
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
export const getStoriesApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/stories`;
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

// Add Story
export const addStoryApi = (data: IAddStory, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/stories`, data, {
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

// Edit Story
export const editStoryApi = (
   storyId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/stories/${storyId}`, formData, {
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

// Delete Story
export const deleteStoryApi = (storyId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/stories/${storyId}`, {
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

// Add Sentence to Story
export const addSentenceToStoryApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/stories/add-sentence`, data, {
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

// Delete Sentence to Story
export const deleteSentenceOfStoryApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/stories/delete-sentence`, data, {
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

// sync story audio
export const syncStoryAudioApi = (storyId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/Stories/sync-story-audio/${storyId}`,
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
