import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getUserApi } from './api/auth.service';
// import VocabDict from './pages/vocabs/VocabDict-old';
import VocabDict from './pages/vocabs/review-dict/vocabDict/vocabDict';
import Home from './pages/Home';
import AddSentence from './pages/sentences/AddSentence';
import Sentences from './pages/sentences/ Sentences';
import EditSentence from './pages/sentences/EditSentence';
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
import EditVocabGroup from './pages/vocabs/vocabGroup/EditVocabGroup';
import StorySentenceReview from './pages/story/review-dict/StorySentenceReview';
import VocabReview from './pages/vocabs/review-dict/vocabReview/vocabReview';
import SentenceReview from './pages/sentences/sentenceReview/sentenceReview';
import SentenceReplacement from './pages/sentences/replacement/SentenceReplacement';
import SentenceDict from './pages/sentences/dict/SentenceDict';
import StorySentenceDict from './pages/story/review-dict/StorySentenceDict';
import Categories from './pages/note/Categories';

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
               <Route path="/vocabs/review" element={<VocabReview />} />
               <Route path="/vocabs/groups" element={<VocabGroups />} />
               <Route
                  path="/vocabs/groups/edit/:vocabGroupId"
                  element={<EditVocabGroup />}
               />

               <Route path="/sentences/add" element={<AddSentence />} />
               <Route path="/sentences" element={<Sentences />} />
               <Route
                  path="/sentences/edit/:sentenceId"
                  element={<EditSentence />}
               />
               <Route path="/sentences/review" element={<SentenceReview />} />
               <Route
                  path="/sentences/replacement"
                  element={<SentenceReplacement />}
               />
               <Route path="/sentences/dict" element={<SentenceDict />} />

               <Route path="/stories" element={<Story />} />
               <Route path="/stories/show/:storyId" element={<ShowStory />} />
               <Route path="/stories/edit/:storyId" element={<EditStory />} />
               <Route
                  path="/stories/review/:storyId"
                  element={<StorySentenceReview />}
               />
               <Route
                  path="/stories/dict/:storyId"
                  element={<StorySentenceDict />}
               />

               <Route
                  path="/categories"
                  element={<Categories />}
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
