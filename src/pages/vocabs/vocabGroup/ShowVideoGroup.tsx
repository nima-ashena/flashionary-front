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

const ShowVocabGroup = () => {
   const { vocabGroupId } = useParams();

   const [vocabGroup, setVocabGroup] = useState<IVocabGroup>({
      _id: '',
      title: '',
   });
   const [translateApi, setTranslateApi] = useState<boolean>(true);
   const [vocab, setVocab] = useState<IVocab>({ title: '' }); // context
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [reverse, setReverse] = useState<boolean>(true);
   const [vocabsLoading, setVocabsLoading] = useState(true);
   const [render, setRender] = useState(false);
   const [addVocabModal, setAddVocabModal] = useState(false);

   const navigate = useNavigate();

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

   const addVocabClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const id = toast.loading('Adding Vocab...');
      addVocabToVocabGroupApi(
         {
            vocabGroupId,
            title: vocab.title,
            meaning: vocab.meaning,
            translateApi,
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setAddVocabModal(false)
               setVocab({ title: '', meaning: '' });
               toast.update(id, {
                  render: 'vocab added successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
            } else {
               toast.update(id, {
                  render: result.response.data.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
            }
         },
      );
   };

   return (
      <div className="container">
         {/* <Back /> */}
         <div className="col-12 col-md-8 col-lg-4">
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
            <button
               className="btn btn-secondary w-100"
               onClick={() => {
                  setAddVocabModal(true);
               }}
            >
               Add Vocab
            </button>
         </div>
         <div className="row mb-3">
            <div className="col-12 col-lg-8">
               {vocabsLoading && (
                  <Button className="w-100 py-3" variant="secondary" disabled>
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
                  {vocabs.map(item => (
                     <>{item.title}</>
                     // <VocabItem
                     //    vocabGroupId={vocabGroupId}
                     //    type={'vocabGroup'}
                     //    item={item}
                     //    key={item._id}
                     //    render={render}
                     //    setRender={setRender}
                     // />
                  ))}
               </ListGroup>
            </div>
         </div>

         {/* Clone Modal */}
         <Modal
            show={addVocabModal}
            onHide={() => {
               setAddVocabModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Adding: {vocab.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>
                  <form className="pt-3">
                     <div className="mb-3">
                        <label className="form-label">Title (*required)</label>
                        <textarea
                           className="form-control"
                           onChange={e => {
                              setVocab({ ...vocab, title: e.target.value });
                           }}
                           value={vocab.title}
                           rows={1}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Meaning</label>
                        <textarea
                           className="form-control"
                           onChange={e => {
                              setVocab({ ...vocab, meaning: e.target.value });
                           }}
                           value={vocab.meaning}
                           rows={1}
                        />
                     </div>
                     <div className="form-check mb-3">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={e => {
                              setTranslateApi(e.target.checked);
                           }}
                           checked={translateApi}
                        />
                        <label className="form-check-label">
                           Translate Api
                        </label>
                     </div>
                     <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 add-btn mb-2"
                        onClick={addVocabClick}
                     >
                        Add Vocab
                     </button>
                  </form>
               </div>
            </Modal.Body>
         </Modal>
      </div>
   );
};

export default ShowVocabGroup;
