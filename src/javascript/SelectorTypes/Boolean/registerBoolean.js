import {Boolean} from './Boolean';
import styles from './Boolean.scss';

export const registerBoolean = ceRegistry => {
    ceRegistry.add('selectorType', 'Checkbox', {
        cmp: Boolean,
        containerStyle: styles.container,
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        }
    });
};
