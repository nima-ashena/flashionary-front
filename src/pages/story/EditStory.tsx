import { useEffect, useRef, useState } from 'react';
import {
   Badge,
   Button,
   Form,
   ListGroup,
   Modal,
   Offcanvas,
   Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
   addSentenceToStoryApi,
   deleteSentenceOfStoryApi,
   getStoryApi,
} from '../../api/story.service';
import { IAddSentence, ISentence } from '../../interface/sentence.interface';
import { IStory } from '../../interface/story.interface';
import SentenceItem from './components/SentenceItem';
import Back from '../../components/Back';
import { List, arrayMove } from 'react-movable';

const EditStory = () => {
   const { storyId } = useParams();

   const [story, setStory] = useState<IStory>({ _id: '', title: '' });
   const [translateApi, setTranslateApi] = useState<boolean>(true);
   const [sentence, setSentence] = useState<IAddSentence>({ context: '' });
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [reverse, setReverse] = useState<boolean>(true);
   const [sentencesLoading, setSentencesLoading] = useState(true);
   const [render, setRender] = useState(false);

   const [replacementModal, setReplacementModal] = useState(false);

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
            context: sentence.context,
            meaning: sentence.meaning,
            storyFlag: sentence.storyFlag,
            storyTough: sentence.storyTough,
            translateApi,
            TTSEngine: localStorage.getItem('defaultTTSEngine'),
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setSentence({ context: '', meaning: '', note: '' });
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
         <div className='row'>
            <section className="col-lg-5 col-12 col-md-10 pt-3">
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
                        setSentence({ ...sentence, context: e.target.value });
                     }}
                     value={sentence.context}
                     rows={3}
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setSentence({ ...sentence, meaning: e.target.value });
                     }}
                     value={sentence.meaning}
                     rows={2}
                  />
               </div>
               <div className="form-check mb-3 d-flex justify-content-between">
                  <div>
                     <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={e => {
                           setSentence({
                              ...sentence,
                              storyFlag: e.target.checked,
                           });
                        }}
                        checked={sentence.storyFlag}
                     />
                     <label className="form-check-label">Flag</label>{' '}
                     <i
                        className="bi bi-flag-fill"
                        style={{ color: '#fc4b08' }}
                     ></i>
                  </div>
                  <div>
                     <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={e => {
                           setSentence({
                              ...sentence,
                              storyTough: e.target.checked,
                           });
                        }}
                        checked={sentence.storyTough}
                     />
                     <label className="form-check-label">Tough</label>{' '}
                     <i className="bi bi-bookmark-fill"></i>
                  </div>
               </div>
               <Form.Check
                  className="mb-3"
                  type="switch"
                  checked={translateApi}
                  onChange={e => {
                     setTranslateApi(e.target.checked);
                  }}
                  label="Translate Api"
               />
               <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 add-btn mb-2"
                  onClick={addSentenceClick}
               >
                  Add Sentence
               </button>
               <hr />

               <Form.Check
                  className="mt-2 mb-2"
                  type="switch"
                  checked={reverse}
                  onChange={e => {
                     setReverse(e.target.checked);
                     setSentences(sentences.reverse());
                  }}
                  label="Reverse"
               />
            </section>
            <section className="col-lg-7 col-12 row">
               <div className="mb-3">
                  {sentencesLoading && (
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
                  <div className="mt-3">
                     <List
                        values={sentences}
                        onChange={({ oldIndex, newIndex }) =>
                           setSentences(
                              arrayMove(sentences, oldIndex, newIndex),
                           )
                        }
                        renderList={({ children, props }) => (
                           <ListGroup {...props}>{children}</ListGroup>
                        )}
                        renderItem={({ value, props }) => (
                           <div className="alert alert-success" {...props}>
                              <p>{value.context}</p>
                           </div>
                        )}
                     />
                  </div>
               </div>
            </section>
         </div>
      </div>
   );
};

export default EditStory;
