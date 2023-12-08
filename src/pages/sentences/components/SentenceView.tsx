import { useEffect, useRef, useState } from 'react';
import { ISentence } from '../../../interface/sentence.interface';
import { getSentenceApi } from '../../../api/sentence.service';
import { toast } from 'react-toastify';
import { Alert, Modal } from 'react-bootstrap';

const SentenceViewModal = props => {
   const { sentenceId, showModal, setShowModal, render } = props;
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
   }, [render]);

   return (
      <Modal
         show={showModal}
         onHide={() => {
            setShowModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>
               Sentence View{' '}
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
                  <label className="form-label">Context</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {sentence.context}
                  </div>
               </div>
               <div className="mb-3">
                  <label className="form-label">Note</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {sentence.note}
                  </div>
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning (Persian)</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                  >
                     {sentence.meaning}
                  </div>
               </div>
               <div className="row">
                  <div className="mb-3 col-lg-6">
                     <label className="form-label">Type</label>
                     <input
                        type="text"
                        className="form-control"
                        value={sentence.type}
                        disabled
                     />
                  </div>
               </div>
               <audio
                  className="mb-2 w-100"
                  controls
                  src={`${sentence.audio}`}
                  ref={audioRef}
                  hidden
               ></audio>
            </form>
         </Modal.Body>
      </Modal>
   );
};

export default SentenceViewModal;
