import { time } from 'console';
import { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Pagination, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getSentencesApi } from '../../api/sentence.service';
import { getStoriesApi } from '../../api/story.service';
import PaginationN, {
   generatePaginationItems,
} from '../../components/pagination/Pagination';
import Sentence from './components/Sentence';
import { IPaginationItem } from '../../interface/common.interface';
import { ISentence } from '../../interface/sentence.interface';
import { IStory } from '../../interface/story.interface';
import { getUsersApi } from '../../api/auth.service';
import { SentenceTypes } from '../../utils/constants';
import { UserContext } from '../../context/common';

const Sentences = () => {
   const [loading, setLoading] = useState(true);
   const [searchModal, setSearchModal] = useState<boolean>(false);

   const limit = 32;
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [render, setRender] = useState<boolean>(false);
   const {
      users,
      userC,
      setUserC,
      query,
      setQuery,
      paginationPage,
      setPaginationPage,
      sort,
      setSort,
      sortC,
      setSortC,
      type,
      setType,
   } = useContext(UserContext);

   const [pages, setPages] = useState<number>(1);

   const [paginationItems, setPaginationItems] = useState<IPaginationItem[]>(
      [],
   );

   const sortValues = [
      { value: '-created_at', name: 'Date - Descending' },
      { value: 'created_at', name: 'Date - Ascending' },
      {value: 'reviewTrueGuessCount', name: 'Review TrueGuessCount - Descending'},
      {value: '-reviewTrueGuessCount', name: 'Review TrueGuessCount - Ascending'},
      {value: 'replacementTrueGuessCount', name: 'Replacement TrueGuessCount - Descending'},
      {value: '-replacementTrueGuessCount', name: 'Replacement TrueGuessCount - Ascending'},
      { value: 'title', name: 'Name - Ascending' },
      { value: '-title', name: 'Name - Descending' },
   ];

   useEffect(() => {
      getSentencesApi(
         (isOk, result) => {
            if (isOk) {
               setSentences(result.sentences);
               setPages(result.responseFilter.pages);
               setPaginationItems(
                  generatePaginationItems(
                     result.responseFilter.pages,
                     paginationPage,
                  ),
               );
               setLoading(false);
            } else {
               console.log(result.message);
            }
         },
         [
            { name: 'sort', value: sort },
            { name: 'limit', value: limit },
            { name: 'page', value: paginationPage },
            { name: 'query', value: query },
            { name: 'type', value: type },
            { name: 'user', value: users[userC]._id },
            { name: 'story', value: 'free' },
         ],
      );
   }, [paginationPage, render]);

   return (
      <>
         <div className="container">
            <div className="p-1">
               <button
                  className="btn btn-lg btn-outline-dark w-100 my-2"
                  onClick={() => {
                     setSearchModal(true);
                  }}
               >
                  Enable Filter...
               </button>
            </div>

            {loading && (
               <Button className="w-100 py-3" variant="primary" disabled>
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

            <div className="row align-items-center px-1 g-1">
               {sentences.length === 0 && (
                  <div className="alert alert-warning" role="alert">
                     There isn't any sentence
                  </div>
               )}
               {sentences.map(item => (
                  <Sentence
                     sentence={item}
                     render={render}
                     setRender={setRender}
                     key={item._id}
                  />
               ))}
            </div>

            <div className="my-4 d-flex justify-content-center">
               <PaginationN
                  page={paginationPage}
                  setPage={setPaginationPage}
                  pages={pages}
                  paginationItems={paginationItems}
                  setPaginationItems={setPaginationItems}
               />
            </div>
         </div>

         <Modal
            show={searchModal}
            onHide={() => {
               setSearchModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Searching...</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3 pt-3">
               <div className="mb-3">
                  <label className="form-label">Search</label>
                  <input
                     type="text"
                     className="form-control"
                     value={query}
                     onChange={e => {
                        setQuery(e.target.value);
                     }}
                  />
               </div>

               <div>
                  <label className="form-label">Sort By</label>
                  <select
                     className="form-select mb-3"
                     aria-label="Default select example"
                     value={sortC}
                     onChange={e => {
                        setSortC(Number(e.target.value));
                     }}
                  >
                     {sortValues.map((item, index) => (
                        <option value={index}>{item.name}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="form-label">Type:</label>
                  <select
                     className="form-select mb-3"
                     aria-label="Default select example"
                     value={type}
                     onChange={e => {
                        if (e.target.value == 'all') return setType('all');
                        setType(e.target.value);
                     }}
                  >
                     <option value={'all'}>All Types</option>
                     {SentenceTypes.map(item => {
                        return <option value={item}>{item}</option>;
                     })}
                  </select>
               </div>

               <div>
                  <label className="form-label">User</label>
                  <select
                     className="form-select mb-3"
                     aria-label="Default select example"
                     value={userC}
                     onChange={e => {
                        setUserC(Number(e.target.value));
                     }}
                  >
                     {users.map((item, index) => (
                        <option value={index}>{item.username}</option>
                     ))}
                  </select>
               </div>

               <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  onClick={e => {
                     e.preventDefault();
                     setSearchModal(false);
                     setRender(!render);
                  }}
               >
                  Search
               </button>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default Sentences;
