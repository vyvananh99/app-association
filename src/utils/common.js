import { intersection, keys, isEqual } from 'lodash';

export const getExactMatchingFields = (obj1, obj2) => {
  const commonKeys = intersection(keys(obj1), keys(obj2));

  return commonKeys.reduce((result, key) => {
    if (isEqual(obj1[key], obj2[key])) {
      result[key] = obj1[key];
    }
    return result;
  }, {});
};
