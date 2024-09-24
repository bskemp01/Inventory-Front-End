import { distinctUntilChanged } from 'rxjs';

const distinctUntilChangedWithProp = (prop: string) => {
  return distinctUntilChanged(sliceSelector(prop));
};

const isObjectEqual = (item1: unknown, item2: unknown): boolean =>
  JSON.stringify(item1) === JSON.stringify(item2);

const sliceSelector = (prop: string) => (prev: any, curr: any) => {
  if (!(prop in prev)) throw new Error('Prop not found in object');
  return isObjectEqual(prev[prop], curr[prop]);
};

export { distinctUntilChangedWithProp, isObjectEqual, sliceSelector}