import {DefaultCrudRepository} from '@loopback/repository';
import {Menu, MenuRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype.id,
  MenuRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Menu, dataSource);
  }
}
