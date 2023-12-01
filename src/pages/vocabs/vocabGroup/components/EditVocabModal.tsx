import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import {
   editVocabApi,
   getVocabApi,
   syncVocabAudioApi,
} from '../../../../api/vocab.service';
import { toast } from 'react-toastify';
import { IVocab } from '../../../../interface/vocab.interface';


const EditVocabModal = props => {
   const {
      render,
      setRender,
      vocabId,
      showEditModal,
      setShowEditModal,
   } = props;
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
   }, []);

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
         },
         (isOk: boolean, result) => {
            if (isOk) {
               setVocab(result.vocab);
               setShowEditModal(false);
               setRender(!render);
               toast.update(t, {
                  render: 'vocab edited successfully',
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
