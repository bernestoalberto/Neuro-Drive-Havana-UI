export interface IUser {
      uid: string;
      email: string;
      displayName: string;
      emailVerified: boolean;
      photoUrl?: string;
      _tokenExpirationDate?: Date;
   }
export class User implements IUser{
  constructor(
    public email: string,
    public uid: string,
    private _token: string,
    public displayName: string,
    public photoUrl: string,
    public _tokenExpirationDate: Date,
    public emailVerified: boolean
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

