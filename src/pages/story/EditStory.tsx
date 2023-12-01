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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
   addSentenceToStoryApi,
   deleteSentenceOfStoryApi,
   deleteStoryApi,
   editStoryApi,
   getStoryApi,
} from '../../api/story.service';
import { IAddSentence, ISentence } from '../../interface/sentence.interface';
import { IStory } from '../../interface/story.interface';
import SentenceItem from './components/SentenceItem';
import Back from '../../components/Back';
import { List, arrayMove } from 'react-movable';
import { storyTypes } from '../../utils/constants';

const EditStory = () => {
   const { storyId } = useParams();
   const navigate = useNavigate();

   const [story, setStory] = useState<IStory>({ _id: '', title: '' });
   const [editedStory, setEditedStory] = useState<IStory>({
      _id: '',
      title: '',
   });
   const [translateApi, setTranslateApi] = useState<boolean>(true);
   const [sentence, setSentence] = useState<IAddSentence>({ context: '' });
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [sentencesLoading, setSentencesLoading] = useState(true);
   const [render, setRender] = useState(false);

   const [replacementMode, setReplacementMode] = useState(false);
   const [editStoryModal, setEditStoryModal] = useState(false);
   const [deleteStoryModal, setDeleteStoryModal] = useState(false);

   useEffect(() => {
      setSentencesLoading(true);
      getStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            setStory(result.story);
            setEditedStory(result.story);
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

   const saveReplacementModeClick = () => {
      let flags: string[] = [];
      let toughs: string[] = [];
      sentences.filter(item => {
         if (item.storyFlag === true) flags.push(item._id);
         if (item.storyTough === true) toughs.push(item._id);
      });
      editStoryApi(storyId, { sentences, flags, toughs }, (isOk, result) => {
         if (isOk) {
            setReplacementMode(false);
            setRender(!render);
         } else {
            toast.error(result.message);
         }
      });
   };

   const editStoryClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      editStoryApi(
         storyId,
         {
            title: editedStory.title,
            note: editedStory.note,
            category: editedStory.category,
         },
         (isOk, result) => {
            if (isOk) {
               setStory(result.story);
               setEditStoryModal(false);
               setRender(!render);
               // setSentences(result.story.sentences.reverse())
            } else {
               toast.error(result.message);
            }
         },
      );
   };

   const deleteStoryClick = () => {
      deleteStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            toast.success('Story deleted successfully');
            navigate('/stories');
         }
      });
   };

   return (
      <div className="container">
         <div className="row pt-2">
            <section className="col-lg-5 col-12 col-md-10 mb-2">
               <div className="d-flex justify-content-between mb-2">
                  <Back url={'/stories'} />
                  <i
                     onClick={() => {
                        setEditStoryModal(true);
                     }}
                     className="bi bi-gear-fill mx-1"
                     style={{ fontSize: 30, margin: 0, cursor: 'pointer' }}
                  ></i>
               </div>
               <div>
                  <div
                     className="alert alert-primary"
                     style={{ marginBottom: 2 }}
                  >
                     {story.title}
                  </div>
                  {story.note && (
                     <div className="alert alert-secondary">{story.note}</div>
                  )}
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
            </section>
            <section className="col-lg-7 col-12 row" style={{ margin: 0 }}>
               <div className="mb-3" style={{ padding: 0 }}>
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
                  <div>
                     <Form.Check
                        className="mt-2 mb-2"
                        type="switch"
                        checked={replacementMode}
                        onChange={e => {
                           let t: any = sentences;
                           setSentence(t.reverse());
                           setReplacementMode(e.target.checked);
                        }}
                        label="ReplacementMode"
                     />
                     {replacementMode && (
                        <>
                           <button
                              className="btn btn-primary mx-1"
                              style={{ width: '47%' }}
                              onClick={saveReplacementModeClick}
                           >
                              Save
                           </button>
                           <button
                              className="btn btn-secondary"
                              style={{ width: '47%' }}
                              onClick={() => {
                                 setRender(!render);
                              }}
                           >
                              Clear
                           </button>
                        </>
                     )}
                  </div>
                  {replacementMode && (
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
                  )}
               </div>
            </section>
         </div>
         {/* Edit Modal */}
         <Modal
            show={editStoryModal}
            onHide={() => {
               setEditStoryModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Edit Story{' '}
                  <Link
                     to={`/stories/show/${story._id}`}
                     className="btn mx-1"
                     style={{ color: '#fff', backgroundColor: '#198754' }}
                  >
                     <i className="bi bi-eye" />
                  </Link>
                  <Link
                     to={`/stories/review/${story._id}`}
                     className="btn my-1 text-light bg-primary"
                  >
                     <i className="bi bi-arrow-repeat" />
                  </Link>
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form className="pt-3">
                  <div className="mb-3">
                     <label className="form-label">Story Title</label>
                     <input
                        type="text"
                        className="form-control"
                        onChange={e => {
                           setEditedStory({
                              ...editedStory,
                              title: e.target.value,
                           });
                        }}
                        value={editedStory.title}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Note</label>
                     <textarea
                        rows={3}
                        className="form-control"
                        value={editedStory.note}
                        onChange={e => {
                           setEditedStory({
                              ...editedStory,
                              note: e.target.value,
                           });
                        }}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Category</label>
                     <select
                        className="form-select"
                        aria-label="Default select example"
                        value={editedStory.category}
                        onChange={e => {
                           setEditedStory({
                              ...editedStory,
                              category: e.target.value,
                           });
                        }}
                     >
                        {storyTypes.map(item => (
                           <option value={item}>{item}</option>
                        ))}
                     </select>
                  </div>
                  <button
                     type="submit"
                     className="btn btn-secondary btn-lg w-100 add-btn mb-2"
                     onClick={editStoryClick}
                  >
                     Save
                  </button>
                  <button
                     type="button"
                     className="btn btn-danger btn-lg w-100 add-btn mb-2"
                     onClick={() => {
                        setEditStoryModal(false);
                        setDeleteStoryModal(true);
                     }}
                  >
                     Delete story
                  </button>
               </form>
            </Modal.Body>
         </Modal>

         {/* Delete Modal */}
         <Modal
            show={deleteStoryModal}
            onHide={() => {
               setDeleteStoryModal(false);
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
                     setDeleteStoryModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteStoryClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default EditStory;

export const editStroyAfter = storyId => {
   let flags: string[] = [];
   let toughs: string[] = [];
   getStoryApi(storyId, (isOk, result) => {
      if (isOk) {
         const sentences: ISentence[] = result.story.sentences;
         sentences.filter(item => {
            if (item.storyFlag === true) flags.push(item._id);
            if (item.storyTough === true) toughs.push(item._id);
         });
         editStoryApi(storyId, { flags, toughs }, (isOk, result) => {
            if (isOk) {
               //
            } else {
               toast.error(result.message);
            }
         });
      }
   });
};
