import { stringify } from 'querystring';
import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addSentenceApi } from '../../api/sentence.service';
import { IAddSentence, ISentence } from '../../interface/sentence.interface';
import { TTSTypes, SentenceTypes } from '../../utils/constants';
import { Dropdown, Form } from 'react-bootstrap';
import EditSentenceModal from './components/EditSentenceModal';

const AddSentence = () => {
   const primaryData: IAddSentence = {
      user: localStorage.getItem('userId'),
      context: '',
      meaning: '',
      translateApi: true,
      reviewImportance: true,
      replacementImportance: true,
      note: '',
      TTSEngine: localStorage.getItem('defaultTTSEngine'),
      type: 'Simple',
   };
   const [sentence, setSentence] = useState<IAddSentence>(primaryData);
   const [sentenceResult, setSentenceResult] = useState<ISentence>(primaryData);

   const [showEditModal, setShowEditModal] = useState(false);
   const [render, setRender] = useState(false)

   const addSentenceClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (sentence.context === '') return toast.warn('Please fill context');

      const id = toast.loading('Adding Sentence...');
      addSentenceApi(sentence, (isOk, result) => {
         if (isOk) {
            toast.dismiss(id)
            setSentenceResult(result.sentence)
            setSentence({ ...sentence, context: '', meaning: '', note: '' });
            setShowEditModal(true)
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
         <p className="mt-3 font-weight-bold" style={{ fontSize: 27 }}>
            Add Sentence
         </p>
         <form
            className="pt-3 col-sm-12 col-md-10 col-lg-8"
            onSubmit={event => {
               addSentenceClick(event);
            }}
         >
            <div className="mb-3">
               <label className="form-label">Context (*required)</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setSentence({
                        ...sentence,
                        context: e.target.value,
                     });
                  }}
                  value={sentence.context}
                  rows={3}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Note</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setSentence({
                        ...sentence,
                        note: e.target.value,
                     });
                  }}
                  rows={3}
                  value={sentence.note}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Meaning (Persian)</label>
               <textarea
                  className="form-control"
                  style={{ direction: 'rtl' }}
                  onChange={e => {
                     setSentence({
                        ...sentence,
                        meaning: e.target.value,
                     });
                  }}
                  rows={2}
                  value={sentence.meaning}
               />
            </div>

            <div className="mb-3">
               <label className="form-check-label">
                  Type: <span style={{ fontWeight: 800 }}>{sentence.type}</span>{' '}
                  <Dropdown style={{ display: 'inline' }}>
                     <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                     ></Dropdown.Toggle>
                     <Dropdown.Menu>
                        {SentenceTypes.map(item => {
                           return (
                              <Dropdown.Item
                                 onClick={e => {
                                    setSentence({ ...sentence, type: item });
                                 }}
                              >
                                 {item}
                              </Dropdown.Item>
                           );
                        })}
                     </Dropdown.Menu>
                  </Dropdown>
               </label>
            </div>

            <div className="d-flex justify-content-between mb-2">
               <div className="form-check">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     onChange={e => {
                        setSentence({
                           ...sentence,
                           reviewImportance: e.target.checked,
                        });
                     }}
                     checked={sentence.reviewImportance}
                  />
                  <label className="form-check-label">Review Importance</label>
               </div>
               <div className="form-check">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     onChange={e => {
                        setSentence({
                           ...sentence,
                           replacementImportance: e.target.checked,
                        });
                     }}
                     checked={sentence.replacementImportance}
                  />
                  <label className="form-check-label">
                     Replacement Importance
                  </label>
               </div>
            </div>

            <Form.Check
               className="mb-3"
               type="switch"
               onChange={e => {
                  setSentence({
                     ...sentence,
                     translateApi: e.target.checked,
                  });
               }}
               checked={sentence.translateApi}
               label="Translate Api"
            />

            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-3"
            >
               Add Sentence
            </button>
         </form>

         <EditSentenceModal
            sentenceId={sentenceResult._id}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            render={render}
            setRender={setRender}
            mode={'add'}
         />

      </div>
   );
};

export default AddSentence;
