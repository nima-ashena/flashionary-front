import { useEffect, useRef, useState } from 'react';
import { Button, ListGroup, Modal, Spinner } from 'react-bootstrap';
import {
   addSentenceToVocabApi,
   editVocabApi,
   getVocabApi,
   syncVocabAudioApi,
} from '../../../../api/vocab.service';
import { toast } from 'react-toastify';
import { IVocab } from '../../../../interface/vocab.interface';
import { ISentence } from '../../../../interface/sentence.interface';
import SentenceItem from '../../components/SentenceItem';
import SentencesModal from '../../components/SentencesModal';
import VocabsModal from '../../components/VocabsModal';

const EditVocabModal = props => {
   const vocabs: IVocab[] = props.vocabs;
   const { vocabId, setVocabs, showEditModal, setShowEditModal, mode } = props;
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const audioRef = useRef<HTMLAudioElement>(null);

   const [showSentencesModal, setShowSentencesModal] = useState(false);
   const [showVocabsModal, setShowVocabsModal] = useState(false);
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [subVocabs, setSubVocabs] = useState<IVocab[]>([]);
   const [render, setRender] = useState(false);

   const [localRender, setLocalRender] = useState(false);

   useEffect(() => {
      if (!showEditModal) return;
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
            setSentences(result.vocab.sentences.reverse());
            setSubVocabs(result.vocab.vocabs.reverse());
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showEditModal, render]);

   useEffect(() => {
      if (!showSentencesModal) return;
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
            setSentences(result.vocab.sentences.reverse());
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [localRender]);

   const editClick = function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (vocab.title === '') return toast.warn('Please fill context');
      const t = toast.loading('Editing Vocab...');
      editVocabApi(
         vocabId,
         {
            title: vocab.title,
            note: vocab.note,
            meaning: vocab.meaning,
            definition: vocab.definition,
            reviewTrueGuessCount: vocab.reviewTrueGuessCount,
            phonetics: vocab.phonetics,
            reviewImportance: vocab.reviewImportance,
            dictImportance: vocab.dictImportance,
         },
         (isOk: boolean, result) => {
            if (isOk) {
               console.log(result.vocab);
               setVocab(result.vocab);
               setShowEditModal(false);
               toast.update(t, {
                  render: 'vocab edited successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
               let ss: IVocab[] = [];
               vocabs.forEach(item => {
                  if (item._id === vocabId) {
                     ss.push(result.vocab);
                  } else {
                     ss.push(item);
                  }
               });
               setVocabs(ss);
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
      const t = toast.loading('Syncing Audio Vocab...');
      syncVocabAudioApi(
         {
            _id: vocabId,

            type,
         },
         (isOk: boolean, result) => {
            if (isOk) {
               setVocab(result);
               toast.update(t, {
                  render:
                     'Vocab audio sync done successfully, Please reload the page',
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
         <Modal
            show={showEditModal}
            onHide={() => {
               setShowEditModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Edit Vocab{' '}
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
                     <label className="form-label">Title</label>
                     <textarea
                        className="form-control"
                        onChange={e => {
                           setVocab({ ...vocab, title: e.target.value });
                        }}
                        value={vocab.title}
                        rows={1}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Note</label>
                     <textarea
                        className="form-control"
                        onChange={e => {
                           setVocab({
                              ...vocab,
                              note: e.target.value,
                           });
                        }}
                        value={vocab.note}
                        rows={3}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Meaning (Persian)</label>
                     <textarea
                        className="form-control"
                        style={{ direction: 'rtl' }}
                        onChange={e => {
                           setVocab({ ...vocab, meaning: e.target.value });
                        }}
                        value={vocab.meaning}
                        rows={1}
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
                        rows={2}
                     />
                  </div>
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">Review TrueGuessCount</label>
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
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">Dict TrueGuessCount</label>
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
                  
                  <div className="mb-3">
                     <label className="form-label">Phonetics</label>
                     <input
                        className="form-control"
                        onChange={e => {
                           setVocab({ ...vocab, phonetics: e.target.value });
                        }}
                        value={vocab.phonetics}
                     />
                  </div>

                  <audio
                     className="mb-2 w-100"
                     controls
                     hidden
                     ref={audioRef}
                     src={`${vocab.audio}`}
                  ></audio>
                  <div>
                     <div>
                        <button
                           type="button"
                           className="btn btn-secondary mb-2 me-2"
                           onClick={() => {
                              syncAudioClick('title');
                           }}
                        >
                           Sync Audio
                        </button>
                        <button
                           type="button"
                           className="btn btn-secondary mb-2 me-2"
                           onClick={() => {
                              syncAudioClick('note');
                           }}
                        >
                           Sync Note Audio
                        </button>
                     </div>
                     <div>
                        <button
                           type="button"
                           className="btn btn-info mb-2 me-1"
                           onClick={() => {
                              setShowEditModal(false);
                              setShowSentencesModal(true);
                           }}
                        >
                           Sentences
                        </button>
                        <button
                           type="button"
                           className="btn btn-info mb-2"
                           onClick={() => {
                              setShowEditModal(false);
                              setShowVocabsModal(true);
                           }}
                        >
                           Vocabs
                        </button>
                     </div>

                     <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 add-btn my-2"
                     >
                        Save
                     </button>
                     {mode === 'add' && (
                        <button
                           type="button"
                           className="btn btn-secondary btn-lg w-100 add-btn my-2"
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

         <SentencesModal
            vocabId={vocabId}
            showSentencesModal={showSentencesModal}
            setShowSentencesModal={setShowSentencesModal}
            setShowEditModal={setShowEditModal}
            sentences={sentences}
            render={render}
            setRender={setRender}
            localRender={localRender}
            setLocalRender={setLocalRender}
         />

         <VocabsModal
            vocabId={vocabId}
            vocab={vocab}
            showVocabsModal={showVocabsModal}
            setShowVocabsModal={setShowVocabsModal}
            setShowEditModal={setShowEditModal}
            vocabs={subVocabs}
            render={render}
            setRender={setRender}
            localRender={localRender}
            setLocalRender={setLocalRender}
         />
      </>
   );
};

export default EditVocabModal;
