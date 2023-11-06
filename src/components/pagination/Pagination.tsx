import { Button, Pagination, Spinner } from 'react-bootstrap';
import { IPaginationItem } from '../../interface/common.interface';

export const generatePaginationItems = (count: number, value: number) => {
   let t = [];
   for (let i = 1; i <= count; i++) {
      if (i === value) t.push({ value: i, active: true });
      else t.push({ value: i, active: false });
   }
   return t;
};

const PaginationN = (props: any) => {
   const page: number = props.page;
   const setPage: React.Dispatch<React.SetStateAction<number>> = props.setPage;
   const pages: number = props.pages;
   const paginationItems: IPaginationItem[] = props.paginationItems;
   const setPaginationItems: React.Dispatch<
      React.SetStateAction<IPaginationItem[]>
   > = props.setPaginationItems;

   const nextClick = () => {
      setPage((prev: number) => Math.min(prev + 1, pages));
   };
   const lastClick = () => {
      setPage(pages);
   };
   const prevClick = () => {
      setPage((prev: number) => Math.max(prev - 1, 1));
   };
   const firstClick = () => {
      setPage(1);
   };

   const pageClick = (value: number) => {
      setPage(value);
      const newPaginationItems = paginationItems.map(item => {
         if (item.value === value) {
            item.active = true;
         } else {
            item.active = false;
         }
         return item;
      });
      setPaginationItems(newPaginationItems);
   };

   return (
      <>
         <Pagination>
            <Pagination.First onClick={firstClick} />
            <Pagination.Prev onClick={prevClick} />

            {paginationItems.map(item => (
               <Pagination.Item
                  onClick={e => {
                     pageClick(item.value);
                  }}
                  active={item.active}
               >
                  {item.value}
               </Pagination.Item>
            ))}

            {/* <Pagination.Ellipsis /> */}
            <Pagination.Next onClick={nextClick} />
            <Pagination.Last onClick={lastClick} />
         </Pagination>
      </>
   );
};

export default PaginationN;
