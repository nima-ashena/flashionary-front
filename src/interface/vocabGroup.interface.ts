export interface IAddVocabGroup {
   title: string;
}


export interface IVocabGroup {
   _id?: string;
   title: string;
   groupKind?: string;
   user?: string;
   created_at?: Date;
}
