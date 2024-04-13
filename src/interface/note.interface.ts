export interface ICategory {
   title: string;
   subjects: any[];
   user?: string;
   pic?: string;
   created_at?: Date;
}

export interface IAddCategory {
   title: string;
}

export interface ISubject {
   title: string;
   notes: any[];
   user?: string;
   created_at?: Date;
}

export interface INote {
   title: string;
   direction: string;
   context: string;
   subject: string;
   pics: any[];
   user?: string;
   created_at?: Date;
}

