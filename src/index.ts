import Joi from 'joi';

const create_route_decorator = (method: string) =>
  function (path: string, middlewares: Function[] = []): Function {
    return function (constructor: Function) {
      const { status_code, schema, has_schema } = constructor.prototype;
      if (!constructor.prototype.route_configs) {
        constructor.prototype.route_configs = [
          {
            path,
            method,
            middlewares,
            status_code,
            schema,
            has_schema,
          },
        ];
      }
    };
  };

export const get = create_route_decorator('get');

export const post = create_route_decorator('post');

export const put = create_route_decorator('put');

export const patch = create_route_decorator('patch');

export const del = create_route_decorator('delete');

export const http_status = function (status_code: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    target.status_code = status_code;
  };
};

export const version = function (version_param: string): Function {
  return function (constructor: Function) {
    const { route_configs } = constructor.prototype;
    for (const iterator of route_configs) {
      if (version_param) {
        if (version_param.indexOf('/') > -1) {
          iterator.path = version_param + iterator.path;
        } else {
          throw new Error('Decorator version need "/" to work.');
        }
      }
    }
  };
};

export const schema = function (
  object_schema: Joi.ObjectSchema<any>
): Function {
  return function (target: any) {
    target.schema = object_schema;
    target.has_schema = true;
  };
};
