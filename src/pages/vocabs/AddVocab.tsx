import { stringify } from 'querystring';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addVocabApi } from '../../api/vocab.service';
import { IAddVocab, IVocab } from '../../interface/vocab.interface';
import { compoundTypes } from '../../utils/constants';
import { Form } from 'react-bootstrap';
import EditVocabModal from './components/EditVocabModal';

const AddVocab = () => {
   const primaryData: IAddVocab = {
      user: localStorage.getItem('userId'),
      title: '',
      definition: '',
      example: '',
      meaning: '',
      note: '',
      phonetics: '',
      dictionaryApi: true,
      noteApi: true,
      translateApi: true,
      dictImportance: true,
      reviewImportance: true,
   };

   const [vocab, setVocab] = useState<IAddVocab>(primaryData);

   const [vocabResult, setVocabResult] = useState<IVocab>(primaryData);
   const [showEditModal, setShowEditModal] = useState(false);
   const [render, setRender] = useState(false);

   const addVocabClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (vocab.title === '') return toast.warn('Please fill title');

      const id = toast.loading('Adding Vocab...');
      addVocabApi(vocab, (isOk, result) => {
         if (isOk) {
            toast.dismiss(id);
            setVocab({ noteApi: vocab.noteApi, ...primaryData });
            setVocabResult(result.vocab);
            setShowEditModal(true);
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
                  style={{ direction: 'rtl' }}
                  className="form-control"
                  onChange={e => {
                     setVocab({ ...vocab, meaning: e.target.value });
                  }}
                  value={vocab.meaning}
               />
            </div>

            <div className="d-flex justify-content-between flex-wrap">
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
               <Form.Check
                  className="mb-3"
                  type="switch"
                  onChange={e => {
                     setVocab({
                        ...vocab,
                        noteApi: e.target.checked,
                     });
                  }}
                  checked={vocab.noteApi}
                  label="Note Api"
               />
            </div>

            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-3"
            >
               +Add Vocab
            </button>
         </form>

         <EditVocabModal
            vocabId={vocabResult._id}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            render={render}
            setRender={setRender}
            mode={'add'}
         />
      </div>
   );
};

export default AddVocab;
