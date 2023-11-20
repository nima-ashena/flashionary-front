import { FC, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cloneVocabApi, deleteVocabApi } from '../../../api/vocab.service';
import { IVocab } from '../../../interface/vocab.interface';
import VocabViewModal from './VocabView';

// const Vocab = ({ vocab }: { vocab: IVocab }, renderValue: boolean) => {
const Vocab = (props: any) => {
   const vocab: IVocab = props.vocab;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;

   const [isThisUserOwnVocab, setIsThisUserOwnVocab] = useState<boolean>(true);
   const userId = localStorage.getItem('userId');
   const [bgColor, setBgColor] = useState('dark');

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
               <div className="card-body text-center">
                  <p className="card-title mb-3">
                     <span className="badge bg-primary mx-2">
                        {vocab.true_guess_count?.toString()}
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
                  <div>
                     <Link
                        to={``}
                        className="btn my-1"
                        style={{ color: 'green', backgroundColor: 'yellow' }}
                        onClick={() => {setShowModal(true)}}
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
                        to={`/vocabs/edit/${vocab._id}`}
                        className="btn my-1"
                        style={{ color: '#fff' }}
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
                           <Button
                              variant="secondary"
                              onClick={() => {
                                 setShowDeleteModal(false);
                              }}
                           >
                              Close
                           </Button>
                           <Button variant="danger" onClick={deleteVocabClick}>
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
               </div>
            </div>
         </div>
      </>
   );
};

export default Vocab;
