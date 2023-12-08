import { FC, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteVocabGroupApi } from '../../../api/vocabGroup.service';
import { IVocabGroup } from '../../../interface/vocabGroup.interface';
import ShowVocabGroupModal from './ShowVocabGroupModal';

const VocabGroup = (props: any) => {
   const vocabGroup: IVocabGroup = props.vocabGroup;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;

   const [showModal, setShowModal] = useState(false);

   const [showDeleteModal, setShowDeleteModal] = useState(false);

   const deleteVocabGroupClick = () => {
      setShowDeleteModal(false);
      deleteVocabGroupApi(vocabGroup._id, (isOk, result) => {
         const t = toast.loading('Deleting VocabGroup...');
         if (isOk) {
            setRender(!render);
            toast.update(t, {
               render: 'vocabGroup deleted successfully',
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

   return (
      <>
         <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card bg-dark text-light" id="vocabGroup">
               <div className="card-body text-center">
                  <p className="card-title mb-3">{vocabGroup.title}</p>
                  <div>
                     <Link
                        to={``}
                        className="btn my-1"
                        onClick={() => {
                           setShowModal(true);
                        }}
                     >
                        <i className="bi bi-eye" style={{ color: '#198754' }} />
                     </Link>
                     <Link
                        to={`/vocabs/groups/edit/${vocabGroup._id}`}
                        className="btn my-1"
                        style={{ color: '#fff' }}
                     >
                        <i className="bi bi-pen" />
                     </Link>
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
                  </div>
               </div>
            </div>
            <ShowVocabGroupModal
               showModal={showModal}
               setShowModal={setShowModal}
               vocabGroupId={vocabGroup._id}
            />
            {/* Delete Modal */}
            <Modal
               show={showDeleteModal}
               onHide={() => {
                  setShowDeleteModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Delete VocabGroup: ?</Modal.Title>
               </Modal.Header>
               <Modal.Body>{vocabGroup.title}</Modal.Body>
               <Modal.Footer>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        setShowDeleteModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button variant="danger" onClick={deleteVocabGroupClick}>
                     Yes
                  </Button>
               </Modal.Footer>
            </Modal>
         </div>
      </>
   );
};

export default VocabGroup;
