import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../interface/vocab.interface';
import { getVocabApi } from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const VocabViewModal = props => {
   const { vocabId, showModal, setShowModal, render } = props;
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if(!showModal) return
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showModal, render]);

   return (
      <Modal
         show={showModal}
         onHide={() => {
            setShowModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>
               Vocab View{' '}
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
            <form className="w-100">
               <div className="mb-3">
                  <label className="form-label">Title</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {vocab.title}
                  </div>
               </div>
               {vocab.note && (
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
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF' }}
                     >
                        {vocab.note}
                     </div>
                  </div>
               )}
               <div className="mb-3">
                  <label className="form-label">Meaning (Persian)</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                  >
                     {vocab.meaning}
                  </div>
               </div>
               <div className="mb-3">
                  <label className="form-label">Definition</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {vocab.definition}
                  </div>
               </div>
               <div className="row">
                  <div className="mb-3 col-6">
                     <label className="form-label">Type</label>
                     <input
                        type="text"
                        className="form-control"
                        value={vocab.type}
                        disabled
                     />
                  </div>
                  <div className="mb-3 col-6">
                     <label className="form-label">Compound Type</label>
                     <input
                        type="text"
                        className="form-control"
                        value={vocab.compoundType}
                        disabled
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="mb-3 col-12">
                     <label className="form-label">Phonetics</label>
                     <input
                        type="text"
                        className="form-control"
                        disabled
                        value={vocab.phonetics}
                     />
                  </div>
               </div>

               <audio
                  className="mb-2 w-100"
                  controls
                  src={`${vocab.audio}`}
                  ref={audioRef}
                  hidden
               ></audio>
               <audio
                  className="mb-2 w-100"
                  controls
                  src={`${vocab.noteAudio}`}
                  ref={noteAudioRef}
                  hidden
               ></audio>

            </form>
         </Modal.Body>
      </Modal>
   );
};

export default VocabViewModal;
