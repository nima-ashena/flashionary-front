import { useEffect, useRef, useState } from 'react';
import {
   Badge,
   Button,
   Form,
   ListGroup,
   Modal,
   Spinner,
} from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
   deleteVocabOfVocabGroupApi,
   deleteVocabGroupApi,
   editVocabGroupApi,
   getVocabGroupApi,
} from '../../../api/vocabGroup.service';
import { ISentence } from '../../../interface/sentence.interface';
import { IVocabGroup } from '../../../interface/vocabGroup.interface';
import SentenceItem from '../../story/components/SentenceItem';
import Back from '../../../components/Back';

const EditVocabGroup = () => {
   const { vocabGroupId } = useParams();
   const navigate = useNavigate();

   const [vocabGroup, setVocabGroup] = useState<IVocabGroup>({
      _id: '',
      title: '',
   });
   const [sentence, setSentence] = useState<string>('');
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [render, setRender] = useState(false);
   const [show, setShow] = useState(false);
   const [reverse, setReverse] = useState<boolean>(false);
   const [sentencesLoading, setSentencesLoading] = useState(true);

   useEffect(() => {
      setSentencesLoading(true);
      getVocabGroupApi(vocabGroupId, (isOk, result) => {
         if (isOk) {
            setVocabGroup(result.vocabGroup);
            setSentences(result.vocabGroup.sentences);
            setSentencesLoading(false);
         } else toast.error(result.message);
      });
   }, [render]);

   const editVocabGroupClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      editVocabGroupApi(vocabGroupId, vocabGroup, (isOk, result) => {
         console.log(result.vocabGroup);
         if (isOk) {
            setVocabGroup(result.vocabGroup);
            toast.success('VocabGroup edited successfully');
            setRender(!render);
            // setSentences(result.vocabGroup.sentences.reverse())
         } else {
            toast.error(result.message);
         }
      });
   };

   const deleteVocabGroupClick = () => {
      deleteVocabGroupApi(vocabGroupId, (isOk, result) => {
         if (isOk) {
            toast.success('VocabGroup deleted successfully');
            navigate('/sentences/stories');
         }
      });
   };

   return (
      <div className="container">
         <Back url={'/vocabs/groups'}/>
         <form className="pt-3 col-12 col-md-10 col-lg-6">
            <div className="mb-3">
               <label className="form-label">VocabGroup Title</label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setVocabGroup({ ...vocabGroup, title: e.target.value });
                  }}
                  value={vocabGroup.title}
               />
            </div>
            
            <hr />
            <button
               type="submit"
               className="btn btn-secondary btn-lg w-100 add-btn mb-2"
               onClick={editVocabGroupClick}
            >
               Edit
            </button>
            <button
               type="button"
               className="btn btn-danger btn-lg w-100 add-btn mb-3"
               onClick={() => {
                  setShow(true);
               }}
            >
               Delete vocabGroup
            </button>
            <Form.Check
               className="mb-2"
               type="switch"
               checked={reverse}
               onChange={e => {
                  setReverse(e.target.checked);
                  setSentences(sentences.reverse());
               }}
               label="Reverse"
            />
         </form>
         <Modal
            show={show}
            onHide={() => {
               setShow(false);
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
                     setShow(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteVocabGroupClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
         <div className="col-12 col-lg-8">
            {sentencesLoading && (
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
               {sentences.map(item => (
                  <SentenceItem
                     vocabGroupId={vocabGroupId}
                     item={item}
                     key={item._id}
                     render={render}
                     setRender={setRender}
                  />
               ))}
            </ListGroup>
         </div>
      </div>
   );
};

export default EditVocabGroup;
