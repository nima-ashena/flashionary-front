import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import {
   deleteVocabApi,
   editVocabApi,
   getVocabApi,
   syncVocabAudioApi,
} from '../../../../api/vocab.service';
import { toast } from 'react-toastify';
import { IVocab } from '../../../../interface/vocab.interface';

const DeleteVocabModal = props => {
   const vocabs: IVocab[] = props.vocabs;
   const { vocabId, setVocabs, showDeleteModal, setShowDeleteModal } = props;
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      getVocabApi(vocabId, (isOk: boolean, result) => {
         if (isOk) {
            setVocab(result.vocab);
         } else {
            console.log(result.message);
            toast.error(result.message);
         }
      });
   }, [showDeleteModal]);
  
   // const deleteVocabClick = () => {
   //    deleteVocabApi(vocabId, (isOk, result) => {
   //       const t = toast.loading('Deleting Vocab...');
   //       if (isOk) {
   //          toast.dismiss(t);
   //          setShowDeleteModal(false);
   //          setReviewPanel(1);
   //          setStateCounter(counterState + 1);
   //          setLeft(left - 1);
   //       } else {
   //          console.log(result.message);
   //          toast.update(t, {
   //             render: result.message,
   //             type: 'error',
   //             isLoading: false,
   //             autoClose: 2000,
   //          });
   //       }
   //    });
   // };

   return (
      <Modal
         show={showDeleteModal}
         onHide={() => {
            setShowDeleteModal(false);
         }}
      >
         {/* <Modal.Header closeButton>
            <Modal.Title>Delete Vocab: ?</Modal.Title>
         </Modal.Header>
         <Modal.Body>{vocabs[counterState]?.title}</Modal.Body>
         <Modal.Footer>
            <Button
               style={{ width: '47%' }}
               variant="secondary"
               onClick={() => {
                  setShowDeleteModal(false);
               }}
            >
               Close
            </Button>
            <Button
               style={{ width: '47%' }}
               variant="danger"
               onClick={deleteVocabClick}
            >
               Yes
            </Button>
         </Modal.Footer> */}
      </Modal>
   );
};

export default DeleteVocabModal;
