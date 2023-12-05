import { time } from 'console';
import { useContext, useEffect, useState } from 'react';
import { Button, Modal, Pagination, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getVocabsApi } from '../../api/vocab.service';
import PaginationN, {
   generatePaginationItems,
} from '../../components/pagination/Pagination';
import Vocab from './Vocab';
import { IPaginationItem } from '../../interface/common.interface';
import { IVocab } from '../../interface/vocab.interface';
import { UserContext } from '../../context/common';
import { getUsersApi } from '../../api/auth.service';

const Vocabs = () => {
   const [loading, setLoading] = useState(true);
   const [searchModal, setSearchModal] = useState<boolean>(false);

   const limit = 24;
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
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
   } = useContext(UserContext);

   const [pages, setPages] = useState<number>(1);

   const [paginationItems, setPaginationItems] = useState<IPaginationItem[]>(
      [],
   );

   // const [sort, setSort] = useState<string>('-created_at');

   useEffect(() => {
      getVocabsApi(
         (isOk, result) => {
            if (isOk) {
               setVocabs(result.vocabs);
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
            { name: 'vocabGroup', value: 'free' },
            { name: 'user', value: users[userC]._id },
         ],
      );
   }, [paginationPage, render]);

   return (
      <>
         <div className="container">
            <div className='p-1'>
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
               {vocabs.length === 0 && (
                  <div className="alert alert-warning" role="alert">
                     There isn't any vocab
                  </div>
               )}
               {vocabs.map(item => (
                  <Vocab
                     vocab={item}
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
               <label className="form-label">User</label>
               <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  onChange={e => {
                     setUserC(Number(e.target.value));
                  }}
               >
                  {users.map((item, index) => (
                     <option value={index}>{item.username}</option>
                  ))}
               </select>
               <label className="form-label">Sort By</label>
               <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  onChange={e => {
                     let t = Number(e.target.value);
                     if (t === 1) setSort('-created_at');
                     if (t === 2) setSort('created_at');
                     if (t === 3) setSort('true_guess_count');
                     if (t === 4) setSort('-true_guess_count');
                     if (t === 5) setSort('title');
                     if (t === 6) setSort('-title');
                  }}
               >
                  <option value="1">Date - Descending</option>
                  <option value="2">Date - Ascending</option>
                  <option value="3">True Guess Count - Descending</option>
                  <option value="4">True Guess Count - Ascending</option>
                  <option value="5">Name - Ascending</option>
                  <option value="6">Name - Descending</option>
               </select>
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

export default Vocabs;
