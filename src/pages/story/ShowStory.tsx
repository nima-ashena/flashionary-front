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
   addSentenceToStoryApi,
   deleteSentenceOfStoryApi,
   getStoryApi,
} from '../../api/story.service';
import { ISentence } from '../../interface/sentence.interface';
import { IStory } from '../../interface/story.interface';
import SentenceItem from './components/SentenceItem';
import Back from '../../components/Back';

const ShowStory = () => {
   const { storyId } = useParams();

   const [story, setStory] = useState<IStory>({ _id: '', title: '' });
   const [translateApi, setTranslateApi] = useState<boolean>(true);
   const [sentence, setSentence] = useState<string>(''); // context
   const [meaning, setMeaning] = useState<string>('');
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [reverse, setReverse] = useState<boolean>(true);
   const [sentencesLoading, setSentencesLoading] = useState(true);
   const [render, setRender] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      setSentencesLoading(true);
      getStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            setStory(result.story);
            setSentences(result.story.sentences.reverse());
            setSentencesLoading(false);
         } else toast.error(result.message);
      });
   }, [render]);

   const addSentenceClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const id = toast.loading('Adding Sentence...');
      addSentenceToStoryApi(
         {
            storyId,
            context: sentence,
            meaning,
            translateApi,
            TTSEngine: localStorage.getItem('defaultTTSEngine'),
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setSentence('');
               setMeaning('');
               toast.update(id, {
                  render: 'sentence added successfully',
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
         <Back />
         <form className="pt-3 col-12 col-md-10 col-lg-6">
            <div className="mb-3">
               <label className="form-label">Story Title</label>
               <input
                  type="text"
                  className="form-control"
                  // onChange={e => {
                  //    setStory({ ...story, title: e.target.value });
                  // }}
                  value={story.title}
                  disabled
               />
            </div>
            <hr />
            <div className="mb-3">
               <label className="form-label">Context (*required)</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setSentence(e.target.value);
                  }}
                  value={sentence}
                  rows={3}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Meaning</label>
               <textarea
                  className="form-control"
                  onChange={e => {
                     setMeaning(e.target.value);
                  }}
                  value={meaning}
                  rows={2}
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
               <label className="form-check-label">Translate Api</label>
            </div>
            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-2"
               onClick={addSentenceClick}
            >
               Add Sentence
            </button>
            <button
               type="submit"
               className="btn btn-success btn-lg w-100 add-btn mb-3"
               onClick={() => {
                  navigate(`/sentences/review/${storyId}`);
               }}
            >
               Review This Story
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
         <div className="row">
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
                        item={item}
                        key={item._id}
                        render={render}
                        setRender={setRender}
                     />
                  ))}
               </ListGroup>
            </div>
         </div>
      </div>
   );
};

export default ShowStory;
