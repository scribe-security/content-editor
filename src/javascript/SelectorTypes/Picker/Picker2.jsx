import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ReferenceCard} from '~/DesignSystem/ReferenceCard';
import {getPathWithoutFile, getDetailedPathArray, getAccordionMode} from './Picker2.utils';
import {PickerDialog} from './PickerDialog/PickerDialog2';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {cePickerPath, cePickerSite, cePickerMode, cePickerClearOpenPaths, cePickerOpenPaths} from '~/SelectorTypes/Picker/Picker2.redux';
import {batchActions} from 'redux-batched-actions';
import {useDispatch} from 'react-redux';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const Picker2 = ({field, value, editorContext, inputContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const pickerConfig = inputContext.selectorType.pickerConfig;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {
        fieldData,
        error,
        loading,
        notFound
    } = pickerConfig.pickerInput.usePickerInputData(value, editorContext);

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );

        console.warn(message);
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const initialPath = getPathWithoutFile(fieldData && fieldData.path ? fieldData.path : `/sites/${editorContext.site}`);
    const detailedPath = getDetailedPathArray(initialPath, editorContext.site);
    const mode = getAccordionMode(initialPath);

    inputContext.actionContext = {
        open: setDialogOpen,
        fieldData,
        editorContext,
        onChange: newValue => onChange(newValue),
        onBlur: onBlur
    };

    const openDialog = isDialogOpen => {
        if (isDialogOpen) {
            dispatch(batchActions([
                cePickerSite(pickerConfig.targetSite ? pickerConfig.targetSite : editorContext.site),
                cePickerPath(initialPath),
                cePickerMode(`picker-${mode}`),
                cePickerOpenPaths(detailedPath)
            ]));
        } else {
            dispatch(batchActions([
                cePickerClearOpenPaths()
            ]));
        }

        setDialogOpen(isDialogOpen);
    };

    return (
        <div className="flexFluid flexRow_nowrap alignCenter">
            <ReferenceCard
                isReadOnly={field.readOnly}
                emptyLabel={t((error || notFound) ? pickerConfig.pickerInput.notFoundLabel : pickerConfig.pickerInput.emptyLabel)}
                emptyIcon={pickerConfig.pickerInput.emptyIcon}
                labelledBy={`${field.name}-label`}
                fieldData={fieldData}
                onClick={() => openDialog(!isDialogOpen)}
            />
            {inputContext.displayActions && value && (
                <DisplayAction
                    actionKey={field.multiple ? 'content-editor/field/MultiplePicker' : 'content-editor/field/Picker'}
                    value={value}
                    field={field}
                    inputContext={inputContext}
                    render={ButtonRenderer}
                />
            )}
            <PickerDialog
                isOpen={isDialogOpen}
                pickerConfig={pickerConfig}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    );
};

Picker2.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

Picker2.displayName = 'Picker2';
