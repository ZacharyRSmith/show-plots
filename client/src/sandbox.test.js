import ApiWrapper from './api_wrapper';
jest.unmock('./helper')

describe('Helper', () => {
    let Helper;

    beforeEach(() => {
        Helper = require('./helper').default;
    });

    it('calls the Api Wrapper', () => {
        Helper.help()

        expect(ApiWrapper.help).toHaveBeenCalled();
    });

});