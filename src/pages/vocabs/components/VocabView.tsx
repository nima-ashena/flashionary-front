import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../interface/vocab.interface';
import { getVocabApi } from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const VocabViewModal = props => {
   const { vocabId, showModal, setShowModal } = props;
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

   return (
      <Modal
         show={showModal}
         onHide={() => {
            setShowModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>
               Vocab View {' '}
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
                  <input
                     type="text"
                     className="form-control"
                     onChange={e => {
                        setVocab({ ...vocab, title: e.target.value });
                     }}
                     value={vocab.title}
                     disabled
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning (Persian)</label>
                  <input
                     type="text"
                     className="form-control"
                     value={vocab.meaning}
                     disabled
                  />
               </div>
               <div className="row">
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">Type</label>
                     <input
                        type="text"
                        className="form-control"
                        value={vocab.type}
                        disabled
                     />
                  </div>
                  <div className="mb-3 col-lg-6">
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
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">Phonetics</label>
                     <input
                        type="text"
                        className="form-control"
                        disabled
                        value={vocab.phonetics}
                     />
                  </div>
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">True Guess Count</label>
                     <input
                        type="number"
                        className="form-control"
                        disabled
                        value={vocab.true_guess_count}
                     />
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
                     disabled
                     rows={3}
                  ></textarea>
               </div>
               <audio
                  className="mb-2 w-100"
                  controls
                  src={`${vocab.audio}`}
                  ref={audioRef}
                  hidden
               ></audio>
            </form>
         </Modal.Body>
      </Modal>
   );
};

export default VocabViewModal;
