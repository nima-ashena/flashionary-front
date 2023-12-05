import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import {
   editVocabApi,
   getVocabApi,
   syncVocabAudioApi,
} from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { IVocab } from '../../../interface/vocab.interface';

const EditVocabModal = props => {
   const vocabs: IVocab[] = props.vocabs;
   const { vocabId, setVocabs, showEditModal, setShowEditModal } = props;
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showEditModal]);

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
            dictTrueGuessCount: vocab.dictTrueGuessCount,
            phonetics: vocab.phonetics,
            reviewImportance: vocab.reviewImportance,
            dictImportance: vocab.dictImportance,
         },
         (isOk: boolean, result) => {
            if (isOk) {
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

   const syncAudioClick = () => {
      const t = toast.loading('Syncing Audio Vocab...');
      syncVocabAudioApi(
         {
            _id: vocabId,
            TTSEngine: localStorage.getItem('defaultTTSEngine'),
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
                  <label className="form-label">Context</label>
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
                     rows={3}
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
                     <label className="form-check-label">Dict Importance</label>
                  </div>
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

export default EditVocabModal;
