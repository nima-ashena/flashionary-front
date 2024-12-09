import { useEffect, useRef, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { ISentence } from '../../../interface/sentence.interface';
import {
   editSentenceApi,
   getSentenceApi,
   syncSentenceAudioApi,
} from '../../../api/sentence.service';
import { toast } from 'react-toastify';
import { SentenceTypes } from '../../../utils/constants';

const EditSentenceModal = props => {
   const mode = props.mode;

   const { sentenceId, showEditModal, setShowEditModal, render, setRender } =
      props;

   const { sentences, setSentences } = props;

   const [sentence, setSentence] = useState<ISentence>({ context: '' });
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (!showEditModal) return;
      getSentenceApi(sentenceId, (isOk: boolean, result) => {
         if (isOk) {
            setSentence(result.sentence);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showEditModal, render]);

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
            replacementTrueGuessCount: sentence.replacementTrueGuessCount,
            reviewTrueGuessCount: sentence.reviewTrueGuessCount,
            reviewImportance: sentence.reviewImportance,
            replacementImportance: sentence.replacementImportance,
         },
         (isOk: boolean, result) => {
            if (isOk) {
               setSentence(result.sentence);
               if (mode !== 'add') setShowEditModal(false);
               toast.update(t, {
                  render: 'sentence edited successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
               if (mode === 'simple') setRender(!render);
               else if (
                  mode === 'review' ||
                  mode === 'replacement' ||
                  mode === 'dict'
               ) {
                  let ss: ISentence[] = [];
                  sentences.forEach(item => {
                     if (item._id === sentenceId) {
                        ss.push(result.sentence);
                     } else {
                        ss.push(item);
                     }
                  });
                  setSentences(ss);
               }
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

   const syncAudioClick = (type: string) => {
      const t = toast.loading('Syncing Audio Sentence...');
      syncSentenceAudioApi(
         {
            _id: sentenceId,
            type,
         },
         (isOk: boolean, result) => {
            if (isOk) {
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
                  <label className="form-label me-1">Note</label>
                  <button
                     type="button"
                     className="btn btn-info mb-1"
                     onClick={() => {
                        noteAudioRef.current?.play();
                     }}
                  >
                     <i className="bi bi-play" />
                  </button>
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

               <div className="mb-3 col-lg-6">
                  <label className="form-check-label">Review</label>
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

               <div className="mb-3 col-lg-6">
                  <label className="form-check-label">Dict</label>
                  <input
                     type="number"
                     className="form-control"
                     onChange={e => {
                        setSentence({
                           ...sentence,
                           dictTrueGuessCount: Number(e.target.value),
                        });
                     }}
                     value={sentence.dictTrueGuessCount}
                  />
               </div>

               <audio
                  className="mb-2 w-100"
                  controls
                  hidden
                  ref={audioRef}
                  src={`${sentence.audio}`}
               ></audio>
               <audio
                  className="mb-2 w-100"
                  controls
                  hidden
                  ref={noteAudioRef}
                  src={`${sentence.noteAudio}`}
               ></audio>
               <div>
                  <button
                     type="button"
                     className="btn btn-secondary mb-2 me-1"
                     onClick={() => {
                        syncAudioClick('context');
                     }}
                  >
                     Sync Audio
                  </button>
                  <button
                     type="button"
                     className="btn btn-secondary mb-2"
                     onClick={() => {
                        syncAudioClick('note');
                     }}
                  >
                     Sync Note Audio
                  </button>

                  <button
                     type="submit"
                     className="btn btn-primary btn-lg w-100 add-btn my-2"
                  >
                     Save
                  </button>
                  {mode === 'add' && (
                     <button
                        type="button"
                        className="btn btn-secondary btn-lg w-100 add-btn"
                        onClick={() => {
                           setShowEditModal(false);
                        }}
                     >
                        Close
                     </button>
                  )}
               </div>
            </form>
         </Modal.Body>
      </Modal>
   );
};

export default EditSentenceModal;
