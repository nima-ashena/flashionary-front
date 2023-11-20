import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ISentence } from '../../interface/sentence.interface';
import {
   cloneSentenceApi,
   deleteSentenceApi,
   getSentenceApi,
   syncSentenceAudioApi,
} from '../../api/sentence.service';
import { editSentenceApi } from '../../api/sentence.service';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { SentenceTypes } from '../../utils/constants';

// ! when edit sentence done, audio doesn't reload
const EditSentence = () => {
   const { sentenceId } = useParams();

   const navigate = useNavigate();

   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showCloneModal, setShowCloneModal] = useState(false);
   const [isThisUserOwnSentence, setIsThisUserOwnSentence] =
      useState<boolean>(true);

   const [sentence, setSentence] = useState<ISentence>({
      _id: '',
      context: '',
      audio: '',
      note: '',
      type: '',
   });
   // const [type, setType] = useState<string>('Simple');
   const [file, setFile] = useState<File>();

   useEffect(() => {
      getSentenceApi(sentenceId, (isOk: boolean, result) => {
         if (isOk) {
            setSentence(result.sentence);
            if (result.sentence.user !== localStorage.getItem('userId'))
               setIsThisUserOwnSentence(false);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, []);

   const handleFileChange = function (e: React.ChangeEvent<HTMLInputElement>) {
      const fileList = e.target.files;
      if (!fileList) return;
      setFile(fileList[0]);
   };

   const submitClick = function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (sentence.context === '') return toast.warn('Please fill context');

      const t = toast.loading('Editing Sentence...');
      const formData = new FormData();
      if (sentence.context) formData.append('context', sentence.context);
      if (sentence.meaning) formData.append('meaning', sentence.meaning);
      if (sentence.note) formData.append('note', sentence.note);
      if (sentence.type) formData.append('type', sentence.type);
      if (file) {
         formData.append('audioFile', file, file.name);
      }
      editSentenceApi(sentenceId, formData, (isOk: boolean, result) => {
         if (isOk) {
            console.log(result.sentence);
            setSentence(result.sentence);
            toast.update(t, {
               render: 'sentence edited successfully, Please reload the page',
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
      });
   };

   const deleteSentenceClick = () => {
      deleteSentenceApi(sentence._id, (isOk, result) => {
         const t = toast.loading('Deleting Sentence...');
         if (isOk) {
            toast.update(t, {
               render: 'sentence deleted successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            navigate('/sentences');
         } else {
            console.log(result.message);
            toast.update(t, {
               render: result.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   const cloneSentenceClick = () => {
      setShowCloneModal(false);
      cloneSentenceApi({ sentenceId: sentence._id }, (isOk, result) => {
         const t = toast.loading('Cloning Sentence...');
         if (isOk) {
            // setRender(!render);
            toast.update(t, {
               render: 'Sentence cloned successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
         } else {
            toast.update(t, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 1500,
            });
         }
      });
   };

   const syncAudioClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const t = toast.loading('Syncing Audio Sentence...');
      syncSentenceAudioApi(
         { _id: sentenceId, TTSEngine: localStorage.getItem('defaultTTSEngine') },
         (isOk: boolean, result) => {
            if (isOk) {
               setSentence(result);
               toast.update(t, {
                  render: 'sentence audio sync done successfully',
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
      <>
         <div className="container">
            <form
               className="pt-3 col-sm-12 col-md-8 col-lg-6 row"
               onSubmit={event => {
                  submitClick(event);
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
                     rows={2}
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning (Persian)</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setSentence({ ...sentence, meaning: e.target.value });
                     }}
                     value={sentence.meaning}
                     rows={2}
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
                     rows={2}
                  />
               </div>

               <audio
                  className="mb-2 w-100"
                  controls
                  src={`${sentence.audio}`}
               ></audio>

               <div>
                  <button
                     type="button"
                     className="btn btn-secondary mb-2"
                     onClick={e => {
                        syncAudioClick(e);
                     }}
                  >
                     Sync Audio
                  </button>
               </div>

               <div className="mb-3">
                  <label className="form-label">Upload Audio</label>
                  <input
                     type="file"
                     className="mx-2"
                     onChange={handleFileChange}
                  />
               </div>

               <div className="col">
                  <button
                     type="submit"
                     className="btn btn-primary btn-lg w-100 add-btn my-2"
                  >
                     Edit Sentence
                  </button>
                  {!isThisUserOwnSentence && (
                     <button
                        type="button"
                        className="btn btn-success btn-lg w-100 add-btn mb-2"
                        onClick={() => {
                           setShowCloneModal(true);
                        }}
                     >
                        Clone Sentence
                     </button>
                  )}
                  {isThisUserOwnSentence && (
                     <button
                        type="button"
                        className="btn btn-danger btn-lg w-100 add-btn mb-2"
                        onClick={() => {
                           setShowDeleteModal(true);
                        }}
                     >
                        Delete Sentence
                     </button>
                  )}
               </div>
            </form>
            {/* Modal */}
            <Modal
               show={showDeleteModal}
               onHide={() => {
                  setShowDeleteModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Delete Sentence: ?</Modal.Title>
               </Modal.Header>
               <Modal.Body>{sentence.context}</Modal.Body>
               <Modal.Footer>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        setShowDeleteModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button variant="danger" onClick={deleteSentenceClick}>
                     Yes
                  </Button>
               </Modal.Footer>
            </Modal>
            {/* Clone Modal */}
            <Modal
               show={showCloneModal}
               onHide={() => {
                  setShowCloneModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Cloning: </Modal.Title>
               </Modal.Header>
               <Modal.Body>{sentence.context}</Modal.Body>
               <Modal.Footer>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        setShowCloneModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button variant="danger" onClick={cloneSentenceClick}>
                     Yes
                  </Button>
               </Modal.Footer>
            </Modal>
         </div>
      </>
   );
};

export default EditSentence;
