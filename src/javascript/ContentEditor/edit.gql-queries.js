import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const NodeDataFragment = {
    nodeData: {
        variables: {
            uilang: 'String!',
            language: 'String!',
            uuid: 'String!',
            writePermission: 'String!',
            childrenFilterTypes: '[String]!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeData on JCRQuery {
            result:nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                lockedAndCannotBeEdited
                isSite: isNodeType(type: {multi: ANY, types: ["jnt:virtualsite"]})
                isPage: isNodeType(type: {multi: ANY, types: ["jnt:page"]})
                isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                isSystemNameReadOnlyMixin: isNodeType(type: {multi: ANY, types: ["jmix:systemNameReadonly"]})
                moveSystemNameToTop: isNodeType(type: {multi: ANY, types: [
                    "jnt:page",
                    "jnt:contentFolder",
                    "jnt:folder",
                    "jnt:file",
                    "jnt:category",
                    "jmix:mainResource"
                ]})
                displayableNode {
                    ...NodeCacheRequiredFields
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                name
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    ...NodeCacheRequiredFields
                    displayName(language: $language)
                    path
                }
                children(typesFilter:{types: $childrenFilterTypes}) {
                    nodes {
                        ...NodeCacheRequiredFields
                        name
                        displayName(language: $language)
                        primaryNodeType {
                            name
                            displayName(language: $language)
                            icon
                        }
                    }
                }
                primaryNodeType {
                    name
                    displayName(language: $uilang)
                    properties {
                        name
                        requiredType
                    }
                    supertypes {
                        name
                    }
                    hasOrderableChildNodes
                }
                properties(language: $language) {
                    name
                    value
                    notZonedDateValue
                    decryptedValue
                    values
                    notZonedDateValues
                    decryptedValues
                    definition {
                        declaringNodeType {
                            name
                        }
                    }
                }
                hasWritePermission: hasPermission(permissionName: $writePermission)
                hasPublishPermission: hasPermission(permissionName: "publish")
                hasStartPublicationWorkflowPermission: hasPermission(permissionName: "publication-start")
                lockInfo {
                    details(language: $language) {
                        owner
                        type
                    }
                }
                wipInfo{
                    status
                    languages
                }
                usages: references {
                    nodes {
                        node {
                            ...NodeCacheRequiredFields
                            displayName
                            path
                            primaryNodeType {
                                icon
                                name
                                displayName(language: $language)
                            }
                            aggregatedPublicationInfo(language: $language) {
                                publicationStatus
                            }
                            operationsSupport {
                                lock
                                markForDeletion
                                publication
                            }
                        }
                    }
                }
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`
    }
};

export const EditFormQuery = gql`
    query editForm($uilang:String!, $language:String!, $uuid: String!, $writePermission: String!, $childrenFilterTypes: [String]!) {
        forms {
            editForm(uiLocale: $uilang, locale: $language, uuidOrPath: $uuid) {
                name
                displayName
                description
                hasPreview
                sections {
                    name
                    displayName
                    description
                    hide
                    expanded
                    fieldSets {
                        name
                        displayName
                        description
                        dynamic
                        activated
                        displayed
                        readOnly
                        fields {
                            name
                            displayName
                            description
                            errorMessage
                            mandatory
                            i18n
                            multiple
                            readOnly
                            requiredType
                            selectorType
                            declaringNodeType
                            selectorOptions {
                                name
                                value
                                values
                            }
                            valueConstraints {
                                value {
                                    type
                                    string
                                }
                                displayValue
                                properties {
                                    name
                                    value
                                }
                            }
                            defaultValues {
                                string
                            }
                        }
                    }
                }
            }
        }
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;

export const NodeQuery = gql`
    query getNodeProperties($uuid:String!, $language:String!, $uilang:String!, $writePermission: String!, $childrenFilterTypes: [String]!) {
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;
