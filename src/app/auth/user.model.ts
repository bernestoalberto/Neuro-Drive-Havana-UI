export interface IUser {
      uid: string;
      email: string;
      displayName: string;
      photoURL: string;
      emailVerified: boolean;
      photoUrl: string;
      _tokenExpirationDate: Date;
   }
export class User implements IUser{
  constructor(
    public email: string,
    public uid: string,
    private _token: string,
    private displayName: string,
    private photoUrl: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

