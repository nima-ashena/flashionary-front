import { FC, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
   cloneSentenceApi,
   deleteSentenceApi,
} from '../../api/sentence.service';
import { ISentence } from '../../interface/sentence.interface';
import SentenceViewModal from './components/SentenceView';
import EditSentenceModal from './components/EditSentenceModal';

// const Sentence = ({ sentence }: { sentence: ISentence }, renderValue: boolean) => {
const Sentence = (props: any) => {
   const sentence: ISentence = props.sentence;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;
   const renderForDelete: boolean = props.renderForDelete;
   const setRenderForDelete = props.setRenderForDelete;

   const [isThisUserOwnVocab, setIsThisUserOwnVocab] = useState<boolean>(true);
   const userId = localStorage.getItem('userId');
   const [bgColor, setBgColor] = useState('dark');

   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showCloneModal, setShowCloneModal] = useState(false);
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      if (userId !== sentence.user) {
         setIsThisUserOwnVocab(false);
         setBgColor('secondary');
      }
   }, []);

   const deleteSentenceClick = () => {
      setShowDeleteModal(false);
      deleteSentenceApi(sentence._id, (isOk, result) => {
         const t = toast.loading('Deleting Sentence...');
         if (isOk) {
            setRenderForDelete(!renderForDelete);
            toast.update(t, {
               render: 'sentence deleted successfully',
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

   const cloneSentenceClick = () => {
      setShowCloneModal(false);
      cloneSentenceApi({ sentenceId: sentence._id }, (isOk, result) => {
         if (isOk) {
            setRender(!render);
         } else {
            toast.error(result.response.data.message);
         }
      });
   };

   return (
      <>
         <div className="col-sm-4 col-md-4 col-lg-3">
            <div className={`card bg-${bgColor} text-light`} id="sentence">
               <div className="card-body text-center">
                  <p className="card-title mb-2">
                     <span className="badge bg-info me-2">
                        {sentence.reviewTrueGuessCount?.toString()}
                     </span>
                     <span className="badge bg-primary me-1">
                        {sentence.replacementTrueGuessCount?.toString()}
                     </span>
                  </p>
                  <p
                     className="card-title mb-2"
                     style={{ height: '45px', overflow: 'hidden' }}
                  >
                     {sentence.context}
                  </p>
                  <p
                     className="card-title mb-2"
                     style={{ height: '45px', overflow: 'hidden' }}
                  >
                     {sentence.meaning ? sentence.meaning : 'x'}
                  </p>
                  <div>
                     <Link
                        to={``}
                        className="btn my-1"
                        style={{ color: 'green' }}
                        onClick={() => {
                           setShowModal(true);
                        }}
                     >
                        <i className="bi bi-eye" />
                     </Link>
                     {!isThisUserOwnVocab && (
                        <Link
                           to={``}
                           className="btn my-1"
                           onClick={() => {
                              setShowCloneModal(true);
                           }}
                        >
                           <i className="bi bi-arrow-down-square-fill"></i>
                        </Link>
                     )}
                     <Link
                        to={''}
                        className="btn my-1"
                        style={{ color: '#fff' }}
                        onClick={() => {
                           setShowEditModal(true);
                        }}
                     >
                        <i className="bi bi-pen" />
                     </Link>
                     {isThisUserOwnVocab && (
                        <Link
                           to={``}
                           className="btn my-1"
                           style={{ color: 'red' }}
                           onClick={() => {
                              setShowDeleteModal(true);
                           }}
                        >
                           <i className="bi bi-trash" />
                        </Link>
                     )}
                  </div>
               </div>
            </div>

            <EditSentenceModal
               sentenceId={sentence._id}
               showEditModal={showEditModal}
               setShowEditModal={setShowEditModal}
               render={render}
               setRender={setRender}
            />

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
            <SentenceViewModal
               sentenceId={sentence._id}
               showModal={showModal}
               setShowModal={setShowModal}
               render={render}
            />
         </div>
      </>
   );
};

export default Sentence;
