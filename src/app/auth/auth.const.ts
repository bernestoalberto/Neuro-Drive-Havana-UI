export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
  // ... and more and more

  // all field above (AND MANY MORE) are alrady provided by firebase
  // let's add some new

  platformId: string;
  lang: string;
  // ... and more and more
}
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

