import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {HeaderUpperSection} from './';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useContentEditorContext, useContentEditorConfigContext} from '~/ContentEditor.context';

jest.mock('~/ContentEditor.context');
jest.mock('formik');
describe('Header UpperSection', () => {
    let defaultProps;
    let formik;
    let contentEditorContext;
    let contentEditorConfigContext;

    beforeEach(() => {
        defaultProps = {
            title: 'yolo'
        };
        contentEditorContext = {
            mode: 'create',
            i18nContext: {},
            nodeData: {
                primaryNodeType: {
                    displayName: 'WIP-WOP'
                }
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        contentEditorConfigContext = {
            envProps: {
                dirtyRef: {
                    current: false
                }
            }
        };
        useContentEditorConfigContext.mockReturnValue(contentEditorConfigContext);

        formik = {
            values: {
                'WIP::Info': {
                    status: Constants.wip.status.DISABLED
                }
            }
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should show the title', () => {
        const cmp = shallowWithTheme(
            <HeaderUpperSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('yolo');
    });
});
