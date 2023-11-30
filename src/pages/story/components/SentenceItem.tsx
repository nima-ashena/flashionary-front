import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteSentenceOfStoryApi } from '../../../api/story.service';
import { deleteSentenceOfVocabApi } from '../../../api/vocab.service';
import { useNavigate } from 'react-router-dom';
import Sentence from '../../sentences/components/Sentence';
import { ISentence } from '../../../interface/sentence.interface';
import EditSentenceModal from './EditSentenceModal';

const SentenceItem = (props: any) => {
   const sentence: ISentence = props.sentence;
   const type = props.type;
   const storyId = props.storyId;
   const vocabId = props.vocabId;
   const render = props.render;
   const setRender = props.setRender;
   const audioRef = useRef<HTMLAudioElement>(null);

   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);

   const trashClick = () => {
      setShowDeleteModal(false);
      if (type === 'story') {
         deleteSentenceOfStoryApi(
            { storyId, sentenceId: sentence._id },
            (isOk, result) => {
               if (isOk) {
                  setRender(!render);
                  toast.success(result.message);
               } else {
                  console.log(result);
                  toast.error(result.response.data.message);
               }
            },
         );
      } else if (type === 'vocab') {
         deleteSentenceOfVocabApi(
            { vocabId, sentenceId: sentence._id },
            (isOk, result) => {
               if (isOk) {
                  setRender(!render);
                  toast.success(result.message);
               } else {
                  toast.error(result.response.data.message);
               }
            },
         );
      }
   };

   return (
      <>
         <ListGroup.Item as="li" style={{ position: 'relative' }}>
            <div className="row">
               <div className="col-12 col-md-8 col-lg-9">
                  <div className="fw-bold mb-2">{sentence.context}</div>
                  <div
                     className="fw-bold mb-2"
                     style={{ direction: 'rtl', textAlign: 'right' }}
                  >
                     {sentence.meaning}
                  </div>
                  <audio
                     hidden
                     className="mb-2 w-100"
                     controls
                     src={`${sentence.audio}`}
                     ref={audioRef}
                  ></audio>
               </div>

               <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center align-items-start">
                  {sentence.storyFlag && (
                     <i
                        className="bi bi-flag-fill"
                        style={{
                           color: '#fc4b08',
                           position: 'absolute',
                           left: 12,
                           bottom: 4,
                        }}
                     ></i>
                  )}
                  {sentence.storyTough && (
                     <i
                        className="bi bi-bookmark-fill"
                        style={{
                           position: 'absolute',
                           left: 32,
                           bottom: 4,
                        }}
                     ></i>
                  )}
                  <button
                     type="button"
                     className="btn btn-secondary m-1"
                     onClick={() => {
                        // navigate(`/sentences/edit/${sentence._id}`);
                        setShowEditModal(true)
                     }}
                  >
                     <i className="bi bi-pen" />
                  </button>
                  <button
                     type="button"
                     className="btn btn-danger m-1"
                     onClick={() => setShowDeleteModal(true)}
                  >
                     <i className="bi bi-trash" />
                  </button>
                  <button
                     type="button"
                     className="btn btn-success m-1"
                     onClick={() => {
                        audioRef.current?.play();
                     }}
                  >
                     <i className="bi bi-play" />
                  </button>
               </div>
            </div>
         </ListGroup.Item>
         <EditSentenceModal
            storyId={storyId}
            render={render}
            setRender={setRender}
            sentenceId={sentence._id}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
         />
         {/* Delete Modal */}
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
               <Button variant="danger" onClick={trashClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default SentenceItem;
