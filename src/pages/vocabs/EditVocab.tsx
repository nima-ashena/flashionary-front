import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, ListGroup, Modal, Spinner } from 'react-bootstrap';

import { IVocab } from '../../interface/vocab.interface';
import {
   addSentenceToVocabApi,
   cloneVocabApi,
   deleteVocabApi,
   getVocabApi,
   syncVocabAudioApi,
} from '../../api/vocab.service';
import { editVocabApi } from '../../api/vocab.service';
import { ISentence } from '../../interface/sentence.interface';
import { compoundTypes } from '../../utils/constants';
import SentenceItem from './components/SentenceItem';

// ! when edit vocab done, audio doesn't reload
const EditVocab = () => {
   const { vocabId } = useParams();

   const navigate = useNavigate();

   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showCloneModal, setShowCloneModal] = useState(false);
   const [isThisUserOwnVocab, setIsThisUserOwnVocab] = useState<boolean>(true);

   const [vocab, setVocab] = useState<IVocab>({ _id: '', title: '' });
   const [file, setFile] = useState<File>();

   const [sentence, setSentence] = useState<string>(''); // context
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [sentencesLoading, setSentencesLoading] = useState(true);
   const [render, setRender] = useState(false);

   useEffect(() => {
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
            setSentences(result.vocab.sentences.reverse());
            setSentencesLoading(false);
            if (result.vocab.user != localStorage.getItem('userId'))
               setIsThisUserOwnVocab(false);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [render]);

   const handleFileChange = function (e: React.ChangeEvent<HTMLInputElement>) {
      const fileList = e.target.files;

      if (!fileList) return;

      setFile(fileList[0]);
   };

   const submitClick = function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (vocab.title === '') return toast.warn('Please fill title');

      const t = toast.loading('Editing Vocab...');
      const formData = new FormData();
      formData.append('title', vocab.title);
      formData.append('meaning', vocab.meaning);
      formData.append('phonetics', vocab.phonetics);
      formData.append('definition', vocab.definition);
      formData.append('example', vocab.example);
      formData.append('type', vocab.type);
      formData.append('compoundType', vocab.compoundType);
      formData.append(
         'reviewTrueGuessCount',
         String(vocab.reviewTrueGuessCount),
      );
      formData.append('dictTrueGuessCount', String(vocab.dictTrueGuessCount));
      formData.append('reviewImportance', String(vocab.reviewImportance));
      formData.append('dictImportance', String(vocab.dictImportance));
      formData.append('completed', String(vocab.completed));
      if (file) {
         formData.append('audioFile', file, file.name);
      }
      editVocabApi(vocabId, formData, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
            // audiRef
            setRender(!render);
            toast.update(t, {
               render: 'Vocab edited successfully',
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

   const deleteVocabClick = () => {
      deleteVocabApi(vocab._id, (isOk, result) => {
         const t = toast.loading('Deleting Vocab...');
         if (isOk) {
            toast.update(t, {
               render: 'vocab deleted successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            navigate('/vocabs');
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

   const addSentenceClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const id = toast.loading('Adding Sentence...');
      addSentenceToVocabApi({ vocabId, context: sentence }, (isOk, result) => {
         if (isOk) {
            setRender(!render);
            setSentence('');
            toast.update(id, {
               render: 'sentence added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            // setSentences(result.story.sentences.reverse());
         } else {
            toast.update(id, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   const cloneVocabClick = () => {
      setShowCloneModal(false);
      cloneVocabApi({ vocabId: vocab._id }, (isOk, result) => {
         const t = toast.loading('Cloning Vocab...');
         if (isOk) {
            setRender(!render);
            toast.update(t, {
               render: 'Vocab cloned successfully',
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

   const syncAudioClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const t = toast.loading('Syncing Audio Vocab...');
      syncVocabAudioApi(
         { _id: vocabId, TTSEngine: localStorage.getItem('defaultTTSEngine') },
         (isOk: boolean, result) => {
            if (isOk) {
               console.log(result);
               setVocab(result);
               toast.update(t, {
                  render:
                     'vocab audio sync done successfully, Please reload the page',
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
            <div className="row">
               <form
                  className="pt-3 col-sm-12 col-md-8 col-lg-5 mb-4"
                  onSubmit={event => {
                     submitClick(event);
                  }}
               >
                  <div className="mb-3">
                     <label className="form-label">Title</label>
                     <input
                        type="text"
                        className="form-control"
                        onChange={e => {
                           setVocab({ ...vocab, title: e.target.value });
                        }}
                        value={vocab.title}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Note</label>
                     <input
                        type="text"
                        className="form-control"
                        onChange={e => {
                           setVocab({ ...vocab, note: e.target.value });
                        }}
                        value={vocab.note}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Meaning (Persian)</label>
                     <input
                        type="text"
                        className="form-control"
                        onChange={e => {
                           setVocab({ ...vocab, meaning: e.target.value });
                        }}
                        value={vocab.meaning}
                     />
                  </div>
                  <div className="row">
                     <div className="mb-3 col-sm-6">
                        <label className="form-label">Type</label>
                        <select
                           className="form-select"
                           aria-label="Default select example"
                           value={vocab.type}
                           onChange={e => {
                              setVocab({ ...vocab, type: e.target.value });
                           }}
                        >
                           <option value="noun">Noun</option>
                           <option value="verb">Verb</option>
                           <option value="adjective">Adjective</option>
                           <option value="adverb">Adverb</option>
                           <option value="nounVerb">Noun, Verb</option>
                        </select>
                     </div>
                     <div className="mb-3 col-sm-6">
                        <label className="form-label">Compound Type</label>
                        <select
                           className="form-select"
                           aria-label="Default select example"
                           value={vocab.compoundType}
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

                  <div className="row">
                     <div className="mb-3 col-6">
                        <label className="form-label">
                           Review TrueGuessCount
                        </label>
                        <input
                           type="number"
                           className="form-control"
                           onChange={e => {
                              setVocab({
                                 ...vocab,
                                 reviewTrueGuessCount: Number(e.target.value),
                              });
                           }}
                           value={vocab.reviewTrueGuessCount}
                        />
                     </div>
                     <div className="mb-3 col-6">
                        <label className="form-label">
                           Dict TrueGuessCount
                        </label>
                        <input
                           type="number"
                           className="form-control"
                           onChange={e => {
                              setVocab({
                                 ...vocab,
                                 dictTrueGuessCount: Number(e.target.value),
                              });
                           }}
                           value={vocab.dictTrueGuessCount}
                        />
                     </div>
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
                        <label className="form-check-label">
                           Review Importance
                        </label>
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
                        <label className="form-check-label">
                           Dict Importance
                        </label>
                     </div>
                  </div>

                  <audio
                     className="mb-2 w-100"
                     controls
                     src={`${vocab.audio}`}
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

                  <div className="col-12">
                     <div className="form-check form-switch">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           checked={vocab?.completed ? true : false}
                           onChange={e => {
                              setVocab({
                                 ...vocab,
                                 completed: e.target.checked,
                              });
                           }}
                        />
                        <label className="form-check-label">completed</label>
                     </div>
                  </div>
                  <div className="col">
                     <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 add-btn my-2"
                     >
                        Save
                     </button>
                     {!isThisUserOwnVocab && (
                        <button
                           type="button"
                           className="btn btn-success btn-lg w-100 add-btn mb-2"
                           onClick={() => {
                              setShowCloneModal(true);
                           }}
                        >
                           Clone Vocab
                        </button>
                     )}
                     {isThisUserOwnVocab && (
                        <button
                           type="button"
                           className="btn btn-danger btn-lg w-100 add-btn mb-2"
                           onClick={() => {
                              setShowDeleteModal(true);
                           }}
                        >
                           Delete Vocab
                        </button>
                     )}
                  </div>
               </form>
               <div className="col-12 col-md-8 col-lg-7 pb-3 pt-2">
                  <div className="mb-3">
                     <label className="form-label">Context (*required)</label>
                     <textarea
                        className="form-control"
                        onChange={e => {
                           setSentence(e.target.value);
                        }}
                        value={sentence}
                        rows={4}
                     />
                  </div>
                  <button
                     type="button"
                     className="btn btn-primary btn-lg w-100 add-btn mb-3"
                     onClick={addSentenceClick}
                  >
                     Add Sentence
                  </button>
                  <div className="col-12">
                     {sentencesLoading && (
                        <Button
                           className="w-100 py-3"
                           variant="secondary"
                           disabled
                        >
                           <Spinner
                              className="mx-2"
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                           />
                           Loading...
                        </Button>
                     )}
                     <ListGroup as="ol">
                        {sentences.map(item => (
                           <SentenceItem
                              vocabId={vocabId}
                              type={'vocab'}
                              item={item}
                              key={item._id}
                              render={render}
                              setRender={setRender}
                           />
                        ))}
                     </ListGroup>
                  </div>
               </div>
            </div>
            {/* Modal */}
            <Modal
               show={showDeleteModal}
               onHide={() => {
                  setShowDeleteModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Delete Vocab: {vocab.title} ?</Modal.Title>
               </Modal.Header>
               <Modal.Footer>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        setShowDeleteModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button variant="danger" onClick={deleteVocabClick}>
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
                  <Modal.Title>Cloning: {vocab.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  Do you want to clone this vocab and add it to your own
                  repository?
               </Modal.Body>
               <Modal.Footer>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        setShowCloneModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button variant="danger" onClick={cloneVocabClick}>
                     Yes
                  </Button>
               </Modal.Footer>
            </Modal>
         </div>
      </>
   );
};

export default EditVocab;
