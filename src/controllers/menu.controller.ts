import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Menu } from '../models';
import { MenuRepository } from '../repositories';
import { classRolesAllowed } from '../decorators';
import { UserRole } from '../enums';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';

@classRolesAllowed({ roles: [UserRole.GUEST] })
export class MenuController {
  constructor(
    @repository(MenuRepository)
    public menuRepository: MenuRepository,
  ) { }

  @post('/menus', {
    responses: {
      '200': {
        description: 'Menu model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Menu) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, { exclude: ['id'] }),
        },
      },
    })
    menu: Omit<Menu, 'id'>,
  ): Promise<Menu> {
    return this.menuRepository.create(menu);
  }

  @get('/menus/count', {
    responses: {
      '200': {
        description: 'Menu model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.menuRepository.count(where);
  }

  @authenticate('JwtStrategy')
  @get('/menus', {
    responses: {
      '200': {
        description: 'Array of Menu model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Menu) },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Menu)) filter?: Filter<Menu>,
  ): Promise<Menu[]> {
    return this.menuRepository.find(filter);
  }

  @patch('/menus', {
    responses: {
      '200': {
        description: 'Menu PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, { partial: true }),
        },
      },
    })
    menu: Menu,
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.menuRepository.updateAll(menu, where);
  }

  @get('/menus/{id}', {
    responses: {
      '200': {
        description: 'Menu model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Menu) } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Menu> {
    return this.menuRepository.findById(id);
  }

  @patch('/menus/{id}', {
    responses: {
      '204': {
        description: 'Menu PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, { partial: true }),
        },
      },
    })
    menu: Menu,
  ): Promise<void> {
    await this.menuRepository.updateById(id, menu);
  }

  @put('/menus/{id}', {
    responses: {
      '204': {
        description: 'Menu PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() menu: Menu,
  ): Promise<void> {
    await this.menuRepository.replaceById(id, menu);
  }

  @del('/menus/{id}', {
    responses: {
      '204': {
        description: 'Menu DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menuRepository.deleteById(id);
  }
}
