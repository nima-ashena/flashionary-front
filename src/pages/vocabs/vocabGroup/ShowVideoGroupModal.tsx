import { useEffect, useRef, useState } from 'react';
import {
   Badge,
   Button,
   Form,
   ListGroup,
   Modal,
   Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
   addVocabToVocabGroupApi,
   deleteVocabOfVocabGroupApi,
   getVocabGroupApi,
} from '../../../api/vocabGroup.service';
import { IVocab } from '../../../interface/vocab.interface';
import { IVocabGroup } from '../../../interface/vocabGroup.interface';
// import VocabItem from '../../../components/vocab/VocabItem';
import Back from '../../../components/Back';
import VocabItem from './components/VocabItem';

const ShowVocabGroupModal = props => {
   const { vocabGroupId, showModal, setShowModal } = props;

   const [vocabGroup, setVocabGroup] = useState<IVocabGroup>({
      _id: '',
      title: '',
   });

   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [vocabsLoading, setVocabsLoading] = useState(true);
   const [render, setRender] = useState(false);

   useEffect(() => {
      setVocabsLoading(true);
      getVocabGroupApi(vocabGroupId, (isOk, result) => {
         if (isOk) {
            setVocabGroup(result.vocabGroup);
            setVocabs(result.vocabGroup.vocabs);
            setVocabsLoading(false);
         } else toast.error(result.message);
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
            <Modal.Title>VideoGroup View</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className="mt-3">
               <div className="mb-3">
                  <label className="form-label">VocabGroup Title</label>
                  <input
                     type="text"
                     className="form-control"
                     // onChange={e => {
                     //    setVocabGroup({ ...vocabGroup, title: e.target.value });
                     // }}
                     value={vocabGroup.title}
                     disabled
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Type</label>
                  <input
                     type="text"
                     className="form-control"
                     // onChange={e => {
                     //    setVocabGroup({ ...vocabGroup, title: e.target.value });
                     // }}
                     value={vocabGroup.groupKind}
                     disabled
                  />
               </div>
            </div>
            <div className="row mb-3">
               <div className="col-12 col-lg-8 mt-3">
                  {vocabsLoading && (
                     <Button
                        className="w-100 py-3"
                        variant="secondary"
                        disabled
                     >
                        <Spinner
                           className="mx-2"
                           as="span"
                           animation="grow"
                           size="sm"
                           role="status"
                           aria-hidden="true"
                        />
                        Loading...
                     </Button>
                  )}
                  <ListGroup as="ol">
                     {vocabs.map(vocab => (
                        <VocabItem
                           vocab={vocab}
                           render={render}
                           setRender={setRender}
                           vocabGroupId={vocabGroupId}
                        />
                     ))}
                  </ListGroup>
               </div>
            </div>
         </Modal.Body>
      </Modal>
   );
};

export default ShowVocabGroupModal;
