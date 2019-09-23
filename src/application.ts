import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MyAuthenticationSequence } from './sequence';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './authentication-strategies';
import { JWTService } from './services/jwt.service';

import {
  TokenServiceBindings,
  UserServiceBindings,
  TokenServiceConstants,
  PasswordHasherBindings
} from './keys/keys';

import { BcryptHasher } from './services/hash.password.bcryptjs';

import { MyUserService } from './services/user-service';


// export interface PackageInfo {
//   name: string;
//   version: string;
//   description: string;
// }

// export const PackageKey = BindingKey.create<PackageInfo>('application.package');

// const pkg: PackageInfo = require('../package.json');

export class MeuIngressoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  constructor(options?: ApplicationConfig) {
    super(options);

    this.setUpBindings();

    // Autenticação
    this.component(AuthenticationComponent);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'lb4-with-password-api',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      components: {
        securitySchemes: {
          APIKeyHeader: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
      paths: {},
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    // this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }


}
