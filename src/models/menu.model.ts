import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Menu extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: true,
  })
  id: string;


  constructor(data?: Partial<Menu>) {
    super(data);
  }
}

export interface MenuRelations {
  // describe navigational properties here
}

export type MenuWithRelations = Menu & MenuRelations;
