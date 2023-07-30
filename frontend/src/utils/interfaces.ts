export interface comicsFields {
    album:string,
    serie:string,
    year:string,
    coverURL:string,
    bedetheque:string,
    _id?:string
}
export interface displayedFields {
    serie:string,
    comics:comicsFields[]
}
export interface userFields {
    [key:string]:string;
}
export interface connectedFields {
    id: string,
    email: string,
    token: string
}
export interface alertProps {
    showAlert:(message:string,type:string) => void;
}

export interface queryResultFields {
    data:[],
    message:string,
    token?:string
}
export interface objectResultFields {
    data:comicsFields,
    message:string
}