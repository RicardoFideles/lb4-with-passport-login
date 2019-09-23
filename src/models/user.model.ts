import { Entity, model, property } from '@loopback/repository';
import { UserProfile, securityId } from '@loopback/security';


@model({ settings: {} })
export class User extends Entity implements UserProfile {
  [attribute: string]: any;
  [securityId]: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
