import {Constants} from '~/ContentEditor.constants';
import {limitSystemNameIfNecessary, replaceSpecialCharacters} from './SystemName.utils';

const registerSystemNameOnChange = registry => {
    registry.add('selectorType.onChange', 'systemNameSync', {
        targets: ['Text'],
        onChange: (previousValue, currentValue, currentField, editorContext) => {
            if (currentField.propertyName === 'jcr:title' &&
                editorContext.mode === Constants.routes.baseCreateRoute &&
                !editorContext.name &&
                window.contextJsParameters.config.defaultSynchronizeNameWithTitle) {
                // Find system name field
                let systemNameField;
                for (const section of editorContext.sections) {
                    for (const fieldSet of section.fieldSets) {
                        for (const field of fieldSet.fields) {
                            if (field.name === Constants.systemName.name) {
                                systemNameField = field;
                                break;
                            }
                        }

                        if (systemNameField) {
                            break;
                        }
                    }

                    if (systemNameField) {
                        break;
                    }
                }

                // I18nContext will be available only after language switch, see useSwitchLanguage for details
                const canSync = editorContext.i18nContext?.memo?.systemNameLang === undefined || editorContext.i18nContext.memo.systemNameLang === editorContext.lang;
                if (systemNameField && !systemNameField.readOnly && canSync) {
                    const cleanedSystemName = replaceSpecialCharacters(currentValue);
                    editorContext.formik.setFieldValue(Constants.systemName.name, limitSystemNameIfNecessary(cleanedSystemName, systemNameField));
                    editorContext.formik.setFieldTouched(Constants.systemName.name, true, false);
                }
            }
        }
    });
};

export default registerSystemNameOnChange;
