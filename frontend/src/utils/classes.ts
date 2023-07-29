//Persos
export class NewCard {
    constructor (
      public pseudo:string,
      public persoName:string,
      public id:string
    ) {}
}

export class NewPerso {
    constructor (
      public pseudo:string,
      public persoName:string
    ) {}
}

//Fruity
export class NewFruit {
    constructor (
        public name:string,
        public url: string,
        public price: number,
        public id: string
    ) {}
}