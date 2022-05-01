import { commonEnvironments } from './common-environments';

describe('commonEnvironments', () => {
  it('should work', () => {
    expect(commonEnvironments()).toEqual('common-environments');
  });
});
