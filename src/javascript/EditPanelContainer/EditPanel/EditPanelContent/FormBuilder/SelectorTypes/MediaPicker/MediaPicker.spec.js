import React from 'react';
import {shallow} from '@jahia/test-framework';
import {MediaPicker} from './MediaPicker';

jest.mock('formik', () => {
    let formikvaluesmock;
    const setFieldValuemock = jest.fn();
    return {
        setFormikValues: values => {
            formikvaluesmock = values;
        },
        setFieldValue: setFieldValuemock,
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock, setFieldValue: setFieldValuemock}}/>
        )
    };
});

import {setFormikValues, setFieldValue} from 'formik';

describe('mediaPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                formDefinition: {
                    name: 'imageid',
                    readOnly: false
                }
            },
            id: 'imageid',
            editorContext: {}
        };

        setFormikValues({imageid: 'ojrzoij'});
    });

    it('should display the MediaPickerFilled when the field is filed', () => {
        setFormikValues({imageid: null});
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('MediaPickerEmpty');
    });

    it('should set formik value when image is Selected', () => {
        setFormikValues({imageid: null});
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        cmp.simulate('imageSelection', [{uuid: 'img'}]);

        expect(setFieldValue).toHaveBeenCalledWith('imageid', 'img', true);
    });

    it('should display the MediaPickerFilled when the field is filed', () => {
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('MediaPickerFilled');
    });

    it('should set readOnly to false if formDefinition is not set readOnly', () => {
        setFormikValues({imageid: null});
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.props().readOnly).toBe(false);
    });

    it('should set readOnly to true if formDefinition is set readOnly', () => {
        setFormikValues({imageid: null});
        defaultProps.field.formDefinition.readOnly = true;
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.props().readOnly).toBe(true);
    });
});
