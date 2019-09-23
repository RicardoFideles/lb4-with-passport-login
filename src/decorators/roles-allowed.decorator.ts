import { MethodDecoratorFactory, ClassDecoratorFactory } from '@loopback/metadata';

export interface RolesAllowedMetadata {
  roles: string[];
}

export function rolesAllowed(spec: RolesAllowedMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<RolesAllowedMetadata>(
    'rolesAllowed',
    spec,
  );
}

export function classRolesAllowed(spec: RolesAllowedMetadata): ClassDecorator {
  const factory = new ClassDecoratorFactory<RolesAllowedMetadata>(
    'rolesAllowed',
    spec,
  );
  return factory.create();
}
