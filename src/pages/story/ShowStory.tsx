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
   deleteSentenceOfStoryApi,
   deleteStoryApi,
   editStoryApi,
   getStoryApi,
} from '../../api/story.service';
import { ISentence } from '../../interface/sentence.interface';
import { IStory } from '../../interface/story.interface';
import SentenceItem from './components/SentenceItem';
import Back from '../../components/Back';

const ShowStory = () => {
   const { storyId } = useParams();
   const navigate = useNavigate();

   const [story, setStory] = useState<IStory>({ _id: '', title: '' });
   const [sentence, setSentence] = useState<string>('');
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [render, setRender] = useState(false);
   const [show, setShow] = useState(false);
   const [reverse, setReverse] = useState<boolean>(false);
   const [sentencesLoading, setSentencesLoading] = useState(true);

   useEffect(() => {
      setSentencesLoading(true);
      getStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            setStory(result.story);
            setSentences(result.story.sentences);
            setSentencesLoading(false);
         } else toast.error(result.message);
      });
   }, [render]);

   const editStoryClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      editStoryApi(storyId, story, (isOk, result) => {
         console.log(result.story);
         if (isOk) {
            setStory(result.story);
            toast.success('Story edited successfully');
            setRender(!render);
            // setSentences(result.story.sentences.reverse())
         } else {
            toast.error(result.message);
         }
      });
   };

   const deleteStoryClick = () => {
      deleteStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            toast.success('Story deleted successfully');
            navigate('/sentences/stories');
         }
      });
   };

   return (
      <div className="container">
         <Back />
         <h1>در دست احداث</h1>
         <form className="pt-3 col-12 col-md-10 col-lg-6">
            <div className="mb-3">
               <label className="form-label">Story Title</label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setStory({ ...story, title: e.target.value });
                  }}
                  value={story.title}
               />
            </div>
            <hr />
            <button
               type="submit"
               className="btn btn-secondary btn-lg w-100 add-btn mb-2"
               onClick={editStoryClick}
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
               Delete story
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
               <Modal.Title>Delete Story: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{story.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShow(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteStoryClick}>
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
         </div>
      </div>
   );
};

export default ShowStory;
