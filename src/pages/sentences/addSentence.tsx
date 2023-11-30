import { stringify } from 'querystring';
import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addSentenceApi } from '../../api/sentence.service';
import { IAddSentence } from '../../interface/sentence.interface';
import { TTSTypes, SentenceTypes } from '../../utils/constants';
import { Dropdown } from 'react-bootstrap';

const AddSentence = () => {
   const primaryData: IAddSentence = {
      user: localStorage.getItem('userId'),
      context: '',
      meaning: '',
      translateApi: true,
      note: '',
      TTSEngine: localStorage.getItem('defaultTTSEngine'),
      type: 'Simple',
   };
   const [sentence, setSentence] = useState<IAddSentence>(primaryData);
   // const [type, setType] = useState<string>('Simple');
   const [defaultTTSEngine, setDefaultTTSEngine] = useState<string>(
      localStorage.getItem('defaultTTSEngine'),
   );

   const addSentenceClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (sentence.context === '') return toast.warn('Please fill context');

      const id = toast.loading('Adding Sentence...');
      addSentenceApi(sentence, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'sentence added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            setSentence({ context: '', meaning: '', note: '' });
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

   const changeDefaultTTSEngineClick = (item: string) => {
      setDefaultTTSEngine(item);
      setSentence({
         ...sentence,
         TTSEngine: item,
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

            <div className="form-check mb-3">
               <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={e => {
                     setSentence({
                        ...sentence,
                        translateApi: e.target.checked,
                     });
                  }}
                  checked={sentence.translateApi}
               />
               <label className="form-check-label">Translate Api</label>
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

            <div className="mb-3">
               <label className="form-check-label">
                  TTS Type:{' '}
                  <span style={{ fontWeight: 800 }}>{defaultTTSEngine}</span>{' '}
                  <Dropdown style={{ display: 'inline' }}>
                     <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                     ></Dropdown.Toggle>
                     <Dropdown.Menu>
                        {TTSTypes.map(item => {
                           return (
                              <Dropdown.Item
                                 onClick={e => {
                                    changeDefaultTTSEngineClick(item);
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

            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-3"
            >
               Add Sentence
            </button>
         </form>
      </div>
   );
};

export default AddSentence;
