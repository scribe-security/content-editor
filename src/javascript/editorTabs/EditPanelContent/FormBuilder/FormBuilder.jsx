import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'formik';
import {useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {SectionsPropTypes} from '~/ContentEditor.proptypes';
import {ChildrenSection, Section} from './Sections';
import {useDispatch, useSelector} from 'react-redux';
import {ceToggleSections} from '~/registerReducer';
import styles from './FormBuilder.scss';
import {Validation} from './Validation';

const ADVANCED_OPTIONS_SELECTIONS = ['visibility'];

export const FormBuilder = ({mode}) => {
    const {nodeData, errors} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const toggleStates = useSelector(state => state.contenteditor.ceToggleSections);
    const dispatch = useDispatch();

    // Update toggle state if there are errors
    useEffect(() => {
        if (errors) {
            const newToggleState = {...toggleStates};
            sections.forEach(section => {
                section.fieldSets.forEach(fieldSet => {
                    fieldSet.fields.forEach(field => {
                        if (errors[field.name]) {
                            newToggleState[section.name] = true;
                        }
                    });
                });
            });
            dispatch(ceToggleSections(newToggleState));
        }
    }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

    // On mount/unmount hook
    useEffect(() => {
        document.querySelector('div[data-first-field=true] input')?.focus();
        // Update section states for this node type
        const newStates = sections ? sections.reduce((acc, curr) => ({...acc, [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded}), toggleStates) : {};
        dispatch(ceToggleSections(newStates));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    let listOrderingIndex = -1;
    const children = sections.filter(s => !ADVANCED_OPTIONS_SELECTIONS.includes(s.name)).map((section, index) => {
        const toggleFcn = e => {
            e.preventDefault();
            dispatch(ceToggleSections({...toggleStates, [section.name]: !toggleStates[section.name]}));
        };

        if (section.name === 'listOrdering') {
            listOrderingIndex = index;
            return (
                <ChildrenSection key={section.name}
                                 mode={mode}
                                 nodeData={nodeData}
                                 section={section}
                                 isExpanded={toggleStates[section.name]}
                                 onClick={toggleFcn}
                />
            );
        }

        if (!section.hide) {
            return (
                <Section key={section.name}
                         section={section}
                         isExpanded={toggleStates[section.name] || false}
                         onClick={toggleFcn}
                />
            );
        }

        return null;
    });

    if (listOrderingIndex !== -1) {
        const lo = children.splice(listOrderingIndex, 1);
        children.splice(1, 0, lo);
    }

    return (
        <>
            <Validation/>
            <Form className={styles.form}>
                <section data-sel-mode={mode}>
                    {children}
                </section>
            </Form>
        </>
    );
};

FormBuilder.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired,
        nodeData: PropTypes.object.isRequired
    })
};

FormBuilder.propTypes = {
    mode: PropTypes.string.isRequired
};
