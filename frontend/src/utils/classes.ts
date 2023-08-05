export class NewComic {
    [key:string]:string;

    constructor (
      public album:string,
      public serie:string,
      public year:string,
      public coverURL:string,
      public bedetheque:string
    ) {}
}
