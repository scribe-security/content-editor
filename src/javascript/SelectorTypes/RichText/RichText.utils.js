import {registry} from '@jahia/ui-extender';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker.utils';
import {DefaultPickerConfig} from '~/SelectorTypes/Picker/configs/DefaultPickerConfig';

const contextPath = (window.contextJsParameters && window.contextJsParameters.contextPath) || '';

const contentPrefix = `${contextPath}/cms/{mode}/{lang}`;
const filePrefix = `${contextPath}/files/{workspace}`;

// Find "URL" input in CKEditor dialog.
function getCKEditorUrlInputId(picker) {
    if (!picker.dialog) {
        return;
    }

    const hasUrl = picker.dialog.getContentElement('info', 'url');
    const eltId = hasUrl ? 'url' : 'txtUrl';

    return eltId;
}

export function fillCKEditorPicker(picker, pickerResult) {
    // Fill Dialog alt title
    const eltId = getCKEditorUrlInputId(picker);

    picker.dialog
        .getContentElement('info', eltId === 'url' ? 'advTitle' : 'txtAlt')
        .setValue(pickerResult.name);

    // Wrap path to build Jahia url.
    picker.setUrl(`${picker.contentPicker ? contentPrefix : filePrefix}${pickerResult.path}${picker.contentPicker ? '.html' : ''}`, {});
}

export function buildPickerContext(picker) {
    const pickerConfig = mergeDeep({}, DefaultPickerConfig, registry.get('pickerConfiguration', picker.type) || registry.get('pickerConfiguration', 'editorial'));

    const urlInput = picker.dialog.getContentElement('info', getCKEditorUrlInputId(picker));
    const valueInInput = urlInput ? urlInput.getValue() : '';
    const currentValue = valueInInput.startsWith(contentPrefix) ?
        valueInInput.substr(contentPrefix.length).slice(0, -('.html').length) :
        valueInInput.substr(filePrefix.length);

    return {pickerConfig, currentValue};
}
