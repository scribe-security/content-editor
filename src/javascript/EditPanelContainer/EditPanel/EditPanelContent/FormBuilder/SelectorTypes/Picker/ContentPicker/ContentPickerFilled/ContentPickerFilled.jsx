import React, {useState} from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {Picker} from '../../../../../../../../DesignSystem/Picker';
import {ContentPickerFilledQuery} from './ContentPickerFilled.gql-queries';
import {encodeJCRPath} from '../../../../../../EditPanel.utils';
import {useQuery} from 'react-apollo-hooks';
import {ContentPickerDialog} from '../ContentPickerDialog';

const ContentPickerFilledCmp = ({t, field, formik, id, uuid, editorContext, nodeTreeConfigs, pickerConfig, setActionContext}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuid: uuid,
            language: editorContext.lang
        }
    });

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const contentData = data.jcr.result;
    const fieldData = {
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    };

    setActionContext({
        open: setIsOpen
    });

    return (
        <>
            <Picker readOnly={field.formDefinition && field.formDefinition.readOnly}
                    fieldData={fieldData}
                    onClick={() => setIsOpen(!isOpen)}
            />

            <ContentPickerDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editorContext={editorContext}
                initialSelectedItem={contentData.path}
                id={id}
                nodeTreeConfigs={nodeTreeConfigs}
                t={t}
                formik={formik}
                field={field}
                pickerConfig={pickerConfig}
            />
        </>
    );
};

ContentPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const ContentPickerFilled = translate()(ContentPickerFilledCmp);
