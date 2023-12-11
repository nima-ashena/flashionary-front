import { useEffect, useRef, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { ISentence } from '../../../../interface/sentence.interface';
import {
   editSentenceApi,
   getSentenceApi,
   syncSentenceAudioApi,
} from '../../../../api/sentence.service';
import { toast } from 'react-toastify';
import { SentenceTypes } from '../../../../utils/constants';

const EditSentenceModal = props => {
   const { render, setRender, sentenceId, showEditModal, setShowEditModal } =
      props;
   const [sentence, setSentence] = useState<ISentence>({ context: '' });
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      getSentenceApi(sentenceId, (isOk: boolean, result) => {
         if (isOk) {
            setSentence(result.sentence);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, []);

   const editClick = function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (sentence.context === '') return toast.warn('Please fill context');

      const t = toast.loading('Editing Sentence...');
      editSentenceApi(
         sentenceId,
         {
            context: sentence.context,
            note: sentence.note,
            meaning: sentence.meaning,
            type: sentence.type,
            reviewTrueGuessCount: sentence.reviewTrueGuessCount,
            replacementTrueGuessCount: sentence.replacementTrueGuessCount,
         },
         (isOk: boolean, result) => {
            if (isOk) {
               setSentence(result.sentence);
               setShowEditModal(false);
               setRender(!render);
               toast.update(t, {
                  render: 'sentence edited successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
            } else {
               console.log(result.message);
               toast.update(t, {
                  render: result.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
            }
         },
      );
   };

   const syncAudioClick = () => {
      const t = toast.loading('Syncing Audio Sentence...');
      syncSentenceAudioApi(
         {
            _id: sentenceId,
            TTSEngine: localStorage.getItem('defaultTTSEngine'),
         },
         (isOk: boolean, result) => {
            if (isOk) {
               setSentence(result);
               toast.update(t, {
                  render:
                     'sentence audio sync done successfully, Please reload the page',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
            } else {
               console.log(result.message);
               toast.update(t, {
                  render: result.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
            }
         },
      );
   };

   return (
      <Modal
         show={showEditModal}
         onHide={() => {
            setShowEditModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>
               Edit Sentence{' '}
               <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={() => {
                     audioRef.current?.play();
                  }}
               >
                  <i className="bi bi-play" />
               </button>
            </Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <form
               className="pt-3 row"
               onSubmit={event => {
                  editClick(event);
               }}
            >
               <div className="mb-3">
                  <label className="form-label">Context</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setSentence({ ...sentence, context: e.target.value });
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
                     value={sentence.note}
                     rows={3}
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning (Persian)</label>
                  <textarea
                     className="form-control"
                     style={{ direction: 'rtl' }}
                     onChange={e => {
                        setSentence({ ...sentence, meaning: e.target.value });
                     }}
                     value={sentence.meaning}
                     rows={3}
                  />
               </div>

               <div className="mb-3">
                  <label className="form-check-label">
                     Type:{' '}
                     <span style={{ fontWeight: 800 }}>{sentence.type}</span>{' '}
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
                                       // setType(item);
                                       setSentence({
                                          ...sentence,
                                          type: item,
                                       });
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
                     <label className="form-label">Review TrueGuessCount</label>
                     <input
                        type="number"
                        className="form-control"
                        onChange={e => {
                           setSentence({
                              ...sentence,
                              reviewTrueGuessCount: Number(e.target.value),
                           });
                        }}
                        value={sentence.reviewTrueGuessCount}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">
                        Replacement TrueGuessCount
                     </label>
                     <input
                        type="number"
                        className="form-control"
                        onChange={e => {
                           setSentence({
                              ...sentence,
                              replacementTrueGuessCount: Number(e.target.value),
                           });
                        }}
                        value={sentence.replacementTrueGuessCount}
                     />
                  </div>


               <audio
                  className="mb-2 w-100"
                  controls
                  hidden
                  ref={audioRef}
                  src={`${sentence.audio}`}
               ></audio>
               <div>
                  <button
                     type="button"
                     className="btn btn-secondary mb-2"
                     onClick={syncAudioClick}
                  >
                     Sync Audio
                  </button>

                  <button
                     type="submit"
                     className="btn btn-primary btn-lg w-100 add-btn my-2"
                  >
                     Save
                  </button>
               </div>
            </form>
         </Modal.Body>
      </Modal>
   );
};

export default EditSentenceModal;
