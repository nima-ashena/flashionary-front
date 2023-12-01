import { useEffect, useRef, useState } from 'react';
import {
   Badge,
   Button,
   Form,
   ListGroup,
   Modal,
   Spinner,
} from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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

   const [reviewModal, setReviewModal] = useState(false);

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
         <div className="d-flex justify-content-between mb-2 pt-2">
            <Back />
            <div>
               <Link
                  to={`/stories/edit/${story._id}`}
                  className="btn my-1 mx-1"
                  style={{ color: '#fff', backgroundColor: 'orange' }}
               >
                  <i className="bi bi-pen" />
               </Link>
               <Link
                  to={`/stories/review/${story._id}`}
                  className="btn my-1 text-light bg-primary"
               >
                  <i className="bi bi-arrow-repeat" />
               </Link>
            </div>
         </div>
         <form className="col-12 col-md-10 col-lg-6">
            <div className="mb-3">
               <div className="alert alert-primary mb-1">{story.title}</div>
               {story.note && (
                  <div className="alert alert-secondary">{story.note}</div>
               )}
            </div>
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
         <div className="col-12 col-lg-8 mb-3">
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
                     storyId={storyId}
                     type={'story'}
                     sentence={item}
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

export default ShowStory;
