import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './authentication-strategies';
import { Services } from './enums';
import { JWTService } from './services/jwt.service';




export class MeuIngressoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  private readonly JWT_SECRET = process.env.SECRET || 'chave-criptografica-super-secreta';

  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Autenticação
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);


    // Set up the custom sequence
    this.sequence(MySequence);

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
        title: 'ibm-orchestrator-api',
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

    this.configureServiceBindings();

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

  private configureServiceBindings() {
    this.bind(Services.TOKEN_SERVICE).toClass(JWTService);
  }


}
