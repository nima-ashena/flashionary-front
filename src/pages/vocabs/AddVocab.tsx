import { stringify } from 'querystring';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addVocabApi } from '../../api/vocab.service';
import { IAddVocab } from '../../interface/vocab.interface';
import { compoundTypes } from '../../utils/constants';
import { Form } from 'react-bootstrap';

const AddVocab = () => {
   const primaryData: IAddVocab = {
      user: localStorage.getItem('userId'),
      title: '',
      definition: '',
      example: '',
      meaning: '',
      note: '',
      phonetics: '',
      type: 'noun',
      dictionaryApi: true,
      translateApi: false,
      dictImportance: true,
      reviewImportance: true,
      TTSEngine: localStorage.getItem('defaultTTSEngine'),
   };
   const [vocab, setVocab] = useState<IAddVocab>(primaryData);

   const addVocabClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (vocab.title === '') return toast.warn('Please fill title');

      const id = toast.loading('Adding Vocab...');
      addVocabApi(vocab, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'vocab added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            setVocab(primaryData);
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
                     setVocab({ ...vocab, title: e.target.value });
                  }}
                  value={vocab.title}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Note</label>
               <textarea
                  rows={2}
                  className="form-control"
                  onChange={e => {
                     setVocab({ ...vocab, note: e.target.value });
                  }}
                  value={vocab.note}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Meaning (Persian)</label>
               <textarea
                  rows={1}
                  className="form-control"
                  onChange={e => {
                     setVocab({ ...vocab, meaning: e.target.value });
                  }}
                  value={vocab.meaning}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Definition</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setVocab({ ...vocab, definition: e.target.value });
                  }}
                  value={vocab.definition}
                  rows={3}
               ></textarea>
            </div>
            <div className="mb-3">
               <label className="form-label">Type</label>
               <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={e => {
                     setVocab({ ...vocab, type: e.target.value });
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
                     setVocab({
                        ...vocab,
                        compoundType: e.target.value,
                     });
                  }}
               >
                  {compoundTypes.map(item => (
                     <option value={item}>{item}</option>
                  ))}
               </select>
            </div>
            <div className="mb-3">
               <label className="form-label">Phonetics</label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setVocab({ ...vocab, phonetics: e.target.value });
                  }}
                  value={vocab.phonetics}
               />
            </div>

            <div className="d-flex justify-content-between mb-2">
               <div className="form-check">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     onChange={e => {
                        setVocab({
                           ...vocab,
                           reviewImportance: e.target.checked,
                        });
                     }}
                     checked={vocab.reviewImportance}
                  />
                  <label className="form-check-label">Review Importance</label>
               </div>
               <div className="form-check">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     onChange={e => {
                        setVocab({
                           ...vocab,
                           dictImportance: e.target.checked,
                        });
                     }}
                     checked={vocab.dictImportance}
                  />
                  <label className="form-check-label">Dict Importance</label>
               </div>
            </div>

            <div className="d-flex justify-content-between mb-3">
               <Form.Check
                  type="switch"
                  onChange={e => {
                     setVocab({
                        ...vocab,
                        dictionaryApi: e.target.checked,
                     });
                  }}
                  checked={vocab.dictionaryApi}
                  label="Dictionary Api"
               />
               <Form.Check
                  type="switch"
                  onChange={e => {
                     setVocab({
                        ...vocab,
                        translateApi: e.target.checked,
                     });
                  }}
                  checked={vocab.translateApi}
                  label="Translate Api"
               />
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
