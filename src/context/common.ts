import { createContext } from 'react';

export const UserContext = createContext({
   isUserLogin: false,
   setIsUserLogin: (auth: boolean) => {},
   vocabs: [],
   setVocabs: (data: any[]) => {},
   users: [],
   setUsers: (data: any[]) => {},
   userC: 0,
   setUserC: (data: number) => {},
   query: '',
   setQuery: (data: string) => {},
   paginationPage: 1,
   setPaginationPage: (data: number) => {},
   sort: '',
   setSort: any => {},
   sortC: 0,
   setSortC: (data: number) => {},
   type: '',
   setType: any => {},
   compoundType: '',
   setCompoundType: (data: string) => {},

});
