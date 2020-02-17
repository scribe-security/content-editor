import {ContentPickerSelectorType} from './index';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});
import {setQueryResponseMock} from '@apollo/react-hooks';

describe('ContentPicker config', () => {
    describe('usePickerInputData', () => {
        const usePickerInputData = ContentPickerSelectorType.pickerInput.usePickerInputData;

        it('should return no data, no error when loading', () => {
            setQueryResponseMock({loading: true});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: true});
        });

        it('should return no data when there is no uuid given', () => {
            setQueryResponseMock({loading: false, data: {}});
            expect(usePickerInputData('', {lang: 'fr'})).toEqual({loading: false});
        });

        it('should return error when there is error', () => {
            setQueryResponseMock({loading: false, error: 'oops'});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, error: 'oops'});
        });

        it('should adapt data when graphql return some data', () => {
            setQueryResponseMock({loading: false, data: {
                jcr: {
                    result: {
                        displayName: 'a cake',
                        path: 'florent/bestArticles',
                        primaryNodeType: {
                            displayName: 'article',
                            icon: 'anUrl'
                        }
                    }
                }
            }});

            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({
                loading: false,
                error: undefined,
                fieldData: {
                    info: 'article',
                    name: 'a cake',
                    path: 'florent/bestArticles',
                    url: 'anUrl.png'
                }
            });
        });
    });
});
