export interface IAddStory {
   title: string;
}

export interface IStory {
   _id: string;
   title: string;
   sentences?: any[];
   cat?: string;
   counterState?: number;
   translateApi?: boolean;
}
