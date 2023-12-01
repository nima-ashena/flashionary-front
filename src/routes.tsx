import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getUserApi } from './api/auth.service';
// import VocabDict from './pages/vocabs/VocabDict-old';
import VocabDict from './pages/vocabs/vocabDict/vocabDict';
import Home from './pages/Home';
import AddSentence from './pages/sentences/addSentence';
import Sentences from './pages/sentences/ Sentences';
import EditSentence from './pages/sentences/editSentence';
import SentenceReview from './pages/sentences/SentenceReview';
import Story from './pages/story/Stories';
import ShowStory from './pages/story/ShowStory';
import EditStory from './pages/story/EditStory';
import Header from './components/Header';
import AddVocab from './pages/vocabs/AddVocab';
import EditVocab from './pages/vocabs/EditVocab';
import Vocabs from './pages/vocabs/Vocabs';
import SignIn from './pages/auth/SignIn';
import Test from './pages/test/Test';
import Setting from './pages/auth/Setting';
import VocabGroups from './pages/vocabs/vocabGroup/VocabGroups';
import ShowVocabGroup from './pages/vocabs/vocabGroup/ShowVideoGroup';
import StorySentenceReview from './pages/story/review/StorySentenceReview';

const RoutesHandle = () => {
   useEffect(() => {}, []);

   return (
      <>
         <Header />
         <PublicRoute>
            <Routes>
               <Route path="/sign-in" element={<SignIn />} />
            </Routes>
         </PublicRoute>
         <PrivateRoute>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/vocabs/add" element={<AddVocab />} />
               <Route path="vocabs" element={<Vocabs />} />
               <Route path="/vocabs/edit/:vocabId" element={<EditVocab />} />
               <Route path="/vocabs/dict" element={<VocabDict />} />
               <Route path="/vocabs/groups" element={<VocabGroups />} />
               <Route
                  path="/vocabs/groups/show/:vocabGroupId"
                  element={<ShowVocabGroup />}
               />
               <Route
                  path="/vocabs/vocab/edit/:VocabGroupId"
                  element={<EditVocab />}
               />

               <Route path="/sentences/add" element={<AddSentence />} />
               <Route path="/sentences" element={<Sentences />} />
               <Route
                  path="/sentences/edit/:sentenceId"
                  element={<EditSentence />}
               />
               <Route
                  path="/sentences/review/:storyId"
                  element={<SentenceReview />}
               />

               <Route path="/stories" element={<Story />} />
               <Route path="/stories/show/:storyId" element={<ShowStory />} />
               <Route path="/stories/edit/:storyId" element={<EditStory />} />
               <Route
                  path="/stories/review/:storyId"
                  element={<StorySentenceReview />}
               />
               
               <Route path="/user/setting" element={<Setting />} />
               <Route path="/test" element={<Test />} />
            </Routes>
         </PrivateRoute>
      </>
   );
};

const PrivateRoute = (props: any) => {
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem('AuthToken')) {
         navigate('/sign-in');
      } else {
         getUserApi((isOk: boolean, result) => {
            if (isOk) {
               // navigate('/');
            } else {
               navigate('/sign-in');
            }
         });
      }
   }, []);

   return <>{props.children}</>;
};
const PublicRoute = (props: any) => {
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem('AuthToken')) {
         navigate('/sign-in');
      } else {
         // console.log('Auth Token');
         getUserApi((isOk: boolean) => {
            if (isOk) {
               // navigate('/');
            } else {
               navigate('/sign-in');
            }
         });
      }
   }, []);

   return <>{props.children}</>;
};

export default RoutesHandle;
