export interface IUser {
      uid: string;
      email: string;
      displayName: string;
     _token: string;
      emailVerified: boolean;
      photoUrl?: string;
      _tokenExpirationDate?: number;
   }
export class User implements IUser {
  constructor(
    public email: string,
    public uid: string,
    public _token: string,
    public displayName: string,
    public photoUrl: string,
    public _tokenExpirationDate: number,
    public emailVerified: boolean
  ) {}

  get token() {
    return this._token;
  }
}


