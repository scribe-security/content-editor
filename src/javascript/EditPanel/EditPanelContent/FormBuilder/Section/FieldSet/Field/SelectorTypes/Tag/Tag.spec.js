import React from 'react';
import {shallow} from '@jahia/test-framework';

import Tag from './Tag';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock = {
        client: {
            query: () => {
                return [];
            }
        }
    };
    return {
        useApolloClient: () => queryresponsemock
    };
});

let useEffect;

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            useEffect = cb();
        }
    };
});

describe('Tag component', () => {
    let props;
    const onDestroy = jest.fn();

    beforeEach(() => {
        props = {
            onDestroy,
            id: 'Tag1',
            field: {
                name: 'myOption',
                displayName: 'My option',
                selectorType: 'Tag',
                readOnly: false,
                multiple: true,
                data: {
                    name: 'myOption',
                    values: ['tag1', 'tag2', 'tag3']
                },
                jcrDefinition: {},
                targets: []
            },
            onChange: jest.fn(),
            onInit: jest.fn()
        };
    });

    it('should bind id correctly', () => {
        const cmp = shallow(<Tag {...props}/>);

        expect(cmp.props().id).toBe(props.id);
    });
    it('should onDestroy called when element detached the element', () => {
        const cmp = shallow(<Tag {...props}/>);
        cmp.unmount();
        useEffect();
        expect(onDestroy).toHaveBeenCalled();
    });

    it('should display each option given', () => {
        const cmp = shallow(<Tag {...props}/>);

        const labels = cmp.props().options.map(o => o.label);
        const values = cmp.props().options.map(o => o.value);
        props.field.data.values.forEach(value => {
            expect(values).toContain(value);
            expect(labels).toContain(value);
        });
    });

    it('should use initial value, and call onInit', () => {
        props.value = ['healthy'];
        const cmp = shallow(<Tag {...props}/>);

        expect(cmp.props().value).toEqual([{label: 'healthy', value: 'healthy'}]);
        expect(props.onInit.mock.calls.length).toBe(1);
        expect(props.onInit).toHaveBeenCalledWith(props.value);
    });

    it('should call onInit', () => {
        const cmp = shallow(<Tag {...props}/>);
        const selection = [{value: 'tag1', label: 'tag1'}, {value: 'tag2', label: 'tag2'}];
        cmp.simulate('change', selection);

        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange).toHaveBeenCalledWith(['tag1', 'tag2']);
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<Tag {...props}/>);

        expect(cmp.props().readOnly).toEqual(readOnly);
    };
});
