import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const getTreeOfContentQuery = `forms {
            contentTypesAsTree(nodeTypes:$nodeTypes, includeSubTypes:$includeSubTypes, nodePath:$path, uiLocale:$uilang, excludedNodeTypes:$excludedNodeTypes) {
                id
                name
                label
                iconURL
                nodeType {
                    mixin
                }
                children {
                    id
                    name
                    nodeType {
                        mixin
                    }
                    parent {
                        id
                        name
                    }
                    label
                    iconURL
                }
            }
        }`;

export const getTreeOfContentWithRequirements = gql`
    query getTreeOfContentWithRequirements($nodeTypes:[String], $includeSubTypes: Boolean, $excludedNodeTypes:[String], $showOnNodeTypes:[String]!, $uilang:String!, $path:String!){
        ${getTreeOfContentQuery}
        jcr {
            nodeByPath(path: $path) {
                isNodeType(type: {types:$showOnNodeTypes})
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const getTreeOfContent = gql`
    query getTreeOfContent($nodeTypes:[String], $includeSubTypes: Boolean, $excludedNodeTypes:[String], $uilang:String!, $path:String!){
        ${getTreeOfContentQuery}
    }
`;
