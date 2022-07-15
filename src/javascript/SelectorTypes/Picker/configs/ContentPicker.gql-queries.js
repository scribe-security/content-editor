import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const ContentPickerFilledQuery = gql`
    query contentPickerFilledQuery($path: String!, $language: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                displayName(language: $language)
                primaryNodeType {
                    name
                    displayName(language: $language)
                    icon
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
