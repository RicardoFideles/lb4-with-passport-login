import { inject } from '@loopback/context';
import { HttpErrors } from '@loopback/rest';
import { TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import * as jwt from 'jsonwebtoken';

export class JWTService implements TokenService {
  constructor(
    @inject('JwtSecret') private jwtSecret: string,
    @inject('JwtTTL') private jwtExpiresIn: string,
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      // tslint:disable-next-line:no-any
      const decryptedToken = jwt.verify(token, this.jwtSecret) as any;
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { id: '', name: '' },
        { id: decryptedToken.id, name: decryptedToken.name },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    // Generate a JSON Web Token
    let token: string;
    try {
      token = jwt.sign(userProfile, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}
