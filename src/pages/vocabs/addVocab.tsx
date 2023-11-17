import { stringify } from 'querystring';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addVocabApi } from '../../api/vocab.service';
import { IAddVocab } from '../../interface/vocab.interface';
import { compoundTypes } from '../../utils/constants';

const AddVocab = () => {
   const primaryData: IAddVocab = {
      user: localStorage.getItem('userId'),
      title: '',
      definition: '',
      example: '',
      meaning: '',
      phonetics: '',
      type: 'noun',
      dictionaryApi: true,
      audioApi: true,
      translateApi: false,
      TTSEngine: localStorage.getItem('defaultTTSEngine'),
   };
   const [vocabData, setVocabData] = useState<IAddVocab>(primaryData);

   const addVocabClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (vocabData.title === '') return toast.warn('Please fill title');

      const id = toast.loading('Adding Vocab...');
      addVocabApi(vocabData, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'vocab added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            setVocabData(primaryData);
         } else {
            console.log(result.message);
            toast.update(id, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   return (
      <div className="container">
         <form
            className="pt-3 col-12 col-md-8 col-lg-6"
            onSubmit={event => {
               addVocabClick(event);
            }}
         >
            <div className="mb-3">
               <label className="form-label">Title (*required)</label>
               <textarea
                  rows={1}
                  className="form-control"
                  onChange={e => {
                     setVocabData({ ...vocabData, title: e.target.value });
                  }}
                  value={vocabData.title}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Meaning (Persian)</label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setVocabData({ ...vocabData, meaning: e.target.value });
                  }}
                  value={vocabData.meaning}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Type</label>
               <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={e => {
                     setVocabData({ ...vocabData, type: e.target.value });
                  }}
               >
                  <option value=""></option>
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                  <option value="nounVerb">Noun, Verb</option>
               </select>
            </div>
            <div className="mb-3">
               <label className="form-label">Compound Type</label>
               <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={e => {
                     setVocabData({ ...vocabData, compoundType: e.target.value });
                  }}
               >
                  {compoundTypes.map(item => (
                     <option value={item}>{item}</option>
                  ))}
               </select>
            </div>
            <div className="mb-3">
               <label className="form-label">Definition</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setVocabData({ ...vocabData, definition: e.target.value });
                  }}
                  value={vocabData.definition}
                  rows={3}
               ></textarea>
            </div>
            <div className="mb-3">
               <label className="form-label">Phonetics</label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setVocabData({ ...vocabData, phonetics: e.target.value });
                  }}
                  value={vocabData.phonetics}
               />
            </div>
            <div className="form-check mb-1">
               <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={e => {
                     setVocabData({
                        ...vocabData,
                        dictionaryApi: e.target.checked,
                     });
                  }}
                  checked={vocabData.dictionaryApi}
               />
               <label className="form-check-label">Dictionary Api</label>
            </div>
            <div className="form-check mb-3">
               <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={e => {
                     setVocabData({
                        ...vocabData,
                        translateApi: e.target.checked,
                     });
                  }}
                  checked={vocabData.translateApi}
               />
               <label className="form-check-label">Translate Api</label>
            </div>

            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-3"
            >
               Add Vocab
            </button>
         </form>
      </div>
   );
};

export default AddVocab;
