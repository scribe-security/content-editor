import React, {useState} from 'react';
import PropTypes from 'prop-types';
import css from './RightPanel.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {Button, SearchContextInput, Typography} from '@jahia/moonstone';
import {shallowEqual, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ContentLayout from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout';
import clsx from 'clsx';
import {DisplayAction, registry} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {SelectionTable, SelectionCaption} from './PickerSelection';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'ghost'}});

const RightPanel = ({pickerConfig, onClose, onItemSelection}) => {
    const {selection, mode} = useSelector(state => ({selection: state.contenteditor.picker.selection, mode: state.contenteditor.picker.mode}), shallowEqual);
    const selectionExpanded = useState(false);
    const {t} = useTranslation('content-editor');

    const selectElement = () => {
        if (selection) {
            // Todo: BACKLOG-12581 - Multiple is not supported yet in pickers. Always return a single value.
            onItemSelection(selection);
        } else {
            onClose();
        }
    };

    const viewSelector = registry.get('accordionItem', mode)?.viewSelector;

    return (
        <div className="flexFluid flexCol_nowrap">
            <header className={clsx('flexCol_nowrap', css.header)}>
                <Typography variant="heading">Select content</Typography>
                <div className={clsx('flexRow_nowrap', 'alignCenter', css.headerActions)}>
                    <SearchContextInput size="big" className={css.searchInput}/>
                    <div className="flexFluid"/>
                    <DisplayAction actionKey="pageComposer" render={ButtonRenderer} path="/"/>
                    {viewSelector}
                </div>
            </header>
            <div className={clsx('flexFluid', 'flexCol_nowrap', css.body)}>
                <ContentLayout pickerConfig={pickerConfig}/>
            </div>

            <SelectionTable selection={selection} expanded={selectionExpanded}/>
            <footer className={clsx('flexRow', 'alignCenter', css.footer)}>
                <SelectionCaption selection={selection} pickerConfig={pickerConfig} expanded={selectionExpanded}/>
                <div className={clsx('flexRow', css.actions)}>
                    <Button
                        data-sel-picker-dialog-action="cancel"
                        size="big"
                        label={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                        onClick={onClose}
                    />
                    <Button
                        data-sel-picker-dialog-action="done"
                        disabled={selection.length === 0}
                        color="accent"
                        size="big"
                        label={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                        onClick={selectElement}
                    />
                </div>
            </footer>
        </div>
    );
};

RightPanel.propTypes = {
    pickerConfig: configPropType.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
