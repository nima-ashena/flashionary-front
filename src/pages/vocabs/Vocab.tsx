import { FC, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cloneVocabApi, deleteVocabApi } from '../../api/vocab.service';
import { IVocab } from '../../interface/vocab.interface';
import VocabViewModal from './components/VocabView';
import EditVocabModal from './components/EditVocabModal';

// const Vocab = ({ vocab }: { vocab: IVocab }, renderValue: boolean) => {
const Vocab = (props: any) => {
   const vocab: IVocab = props.vocab;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;

   const [isThisUserOwnVocab, setIsThisUserOwnVocab] = useState<boolean>(true);
   const userId = localStorage.getItem('userId');
   const [bgColor, setBgColor] = useState('dark');

   const [showEditModal, setShowEditModal] = useState(false);

   useEffect(() => {
      if (userId !== vocab.user) {
         setIsThisUserOwnVocab(false);
         setBgColor('secondary');
      }
   }, []);

   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showCloneModal, setShowCloneModal] = useState(false);
   const [showModal, setShowModal] = useState(false);

   const deleteVocabClick = () => {
      setShowDeleteModal(false);
      deleteVocabApi(vocab._id, (isOk, result) => {
         const t = toast.loading('Deleting Vocab...');
         if (isOk) {
            setRender(!render);
            toast.update(t, {
               render: 'vocab deleted successfully',
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
            toast.update(t, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 1500,
            });
         }
      });
   };

   return (
      <>
         <div className="col-sm-4 col-md-4 col-lg-3">
            <div className={`card bg-${bgColor} text-light`} id="vocab">
               <div
                  className="card-body text-center"
                  style={{ position: 'relative' }}
               >
                  <p className="card-title mb-3">
                     <span className="badge bg-info me-1">
                        {vocab.reviewTrueGuessCount?.toString()}
                     </span>
                     <span className="badge bg-primary me-2">
                        {vocab.dictTrueGuessCount?.toString()}
                     </span>
                     {vocab.title}
                     {vocab?.completed === true && (
                        <i
                           className="bi bi-check-circle-fill mx-2"
                           style={{ color: 'green' }}
                        ></i>
                     )}
                  </p>
                  <p
                     className="card-title mb-3"
                     style={{ height: '23px', overflow: 'hidden' }}
                  >
                     {vocab.meaning ? vocab.meaning : 'x'}
                  </p>
                  <div className="mb-2">
                     <Link
                        to={``}
                        className="btn my-1"
                        style={{ color: 'black', backgroundColor: 'yellow' }}
                        onClick={() => {
                           setShowModal(true);
                        }}
                     >
                        <i className="bi bi-eye" />
                     </Link>
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

                     <EditVocabModal
                        vocabId={vocab._id}
                        showEditModal={showEditModal}
                        setShowEditModal={setShowEditModal}
                        render={render}
                        setRender={setRender}
                     />

                     {/* Delete Modal */}
                     <Modal
                        show={showDeleteModal}
                        onHide={() => {
                           setShowDeleteModal(false);
                        }}
                     >
                        <Modal.Header closeButton>
                           <Modal.Title>
                              Delete Vocab: {vocab.title} ?
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                           <div className="row w-100">
                              <div
                                 className="col-6"
                                 style={{ paddingRight: 2 }}
                              >
                                 <button
                                    style={{
                                       fontSize: 18,
                                       width: '100%',
                                    }}
                                    className="btn btn-danger mb-2"
                                    onClick={() => {
                                       setShowDeleteModal(false);
                                    }}
                                 >
                                    Close
                                 </button>
                              </div>
                              <div className="col-6" style={{ paddingLeft: 2 }}>
                                 <button
                                    style={{
                                       fontSize: 18,
                                       width: '100%',
                                    }}
                                    className="btn btn-success mb-2"
                                    onClick={deleteVocabClick}
                                 >
                                    Yes
                                 </button>
                              </div>
                           </div>
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
                           Do you want to clone this vocab and add it to your
                           own repository?
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

                     <VocabViewModal
                        vocabId={vocab._id}
                        showModal={showModal}
                        setShowModal={setShowModal}
                     />
                  </div>
                  <div style={{ position: 'absolute', bottom: 4, right: 8 }}>
                     {vocab.user?.name}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Vocab;
