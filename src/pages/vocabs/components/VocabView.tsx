import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../interface/vocab.interface';
import { getVocabApi } from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { ListGroup, Modal } from 'react-bootstrap';
import VocabsModal from './VocabsModal';
import SentencesModal from './SentencesModal';
import { ISentence } from '../../../interface/sentence.interface';

const VocabViewModal = props => {
   const {
      vocabId,
      showModal,
      setShowModal,
      render,
      setRender,
      setShowEditModal,
   } = props;
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);

   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [showSentencesModal, setShowSentencesModal] = useState(false);
   const [showVocabsModal, setShowVocabsModal] = useState(false);
   const [localRender, setLocalRender] = useState(false);

   useEffect(() => {
      if (!showModal) return;
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
            setSentences(result.vocab.sentences.reverse());
            setVocabs(result.vocab.vocabs.reverse());
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showModal, render]);

   return (
      <div>
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

                  <div>
                     <button
                        type="button"
                        className="btn btn-info mb-2 me-1"
                        onClick={() => {
                           setShowEditModal(false);
                           setShowSentencesModal(true);
                        }}
                     >
                        Sentences ({vocab?.sentences?.length})
                     </button>
                     <button
                        type="button"
                        className="btn btn-info mb-2"
                        onClick={() => {
                           setShowEditModal(false);
                           setShowVocabsModal(true);
                        }}
                     >
                        Vocabs ({vocab?.vocabs?.length})
                     </button>
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
            vocabs={vocabs}
            render={render}
            setRender={setRender}
            localRender={localRender}
            setLocalRender={setLocalRender}
         />
      </div>
   );
};

export default VocabViewModal;
