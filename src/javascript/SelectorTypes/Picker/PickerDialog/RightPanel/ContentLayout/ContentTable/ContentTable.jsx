import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useExpanded, useTable} from 'react-table';
import {useRowSelection, useSort} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    cePickerMode,
    cePickerOpenPaths, cePickerPath,
    cePickerRemoveSelection,
    cePickerSetPage,
    cePickerSetPageSize, cePickerSetTableViewType
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {flattenTree} from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentLayout.utils';

const UploadTransformComponent = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.UploadTransformComponent})));
const ContentNotFound = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentNotFound})));
const ContentEmptyDropZone = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentEmptyDropZone})));
const EmptyTable = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.EmptyTable})));
const ContentListHeader = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentListHeader})));
const ContentTableWrapper = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTableWrapper})));
const ContentTypeSelector = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTypeSelector})));

const contentTypeSelectorProps = {
    selector: state => state.contenteditor.picker.tableView,
    reduxActions: {
        setPageAction: page => cePickerSetPage(page),
        setTableViewTypeAction: view => cePickerSetTableViewType(view)
    }
};

const ContentTypeSelectorComp = props => React.createElement(ContentTypeSelector, {...props, ...contentTypeSelectorProps});

export const allowDoubleClickNavigation = (nodeType, subNodes, fcn) => {
    if (['jnt:page', 'jnt:folder', 'jnt:contentFolder'].indexOf(nodeType) !== -1 || (subNodes && subNodes > 0)) {
        return fcn;
    }

    return function () {};
};

const selector = state => ({
    mode: state.contenteditor.picker.mode.replace('picker-', ''),
    siteKey: state.contenteditor.picker.site,
    path: state.contenteditor.picker.path,
    pagination: state.contenteditor.picker.pagination,
    selection: state.contenteditor.picker.selection,
    tableView: state.contenteditor.picker.tableView
});

const reduxActions = {
    onPreviewSelectAction: () => ({}),
    setOpenPathAction: path => cePickerOpenPaths(getDetailedPathArray(path)),
    setPathAction: path => cePickerPath(path),
    setModeAction: mode => cePickerMode(mode),
    setCurrentPageAction: page => cePickerSetPage(page - 1),
    setPageSizeAction: pageSize => cePickerSetPageSize(pageSize),
    removeSelectionAction: path => cePickerRemoveSelection(path)
};

export const ContentTable = ({
    rows,
    isContentNotFound,
    totalCount,
    dataCounts,
    isLoading}) => {
    const {t} = useTranslation();
    const {
        mode,
        path,
        pagination,
        selection,
        tableView
    } = useSelector(selector, shallowEqual);
    const dispatch = useDispatch();
    const isStructuredView = Constants.tableView.mode.STRUCTURED === tableView.viewMode;
    const paths = useMemo(() => flattenTree(rows).map(n => n.path), [rows]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow,
        toggleAllRowsExpanded
    } = useTable(
        {
            columns: allColumnData,
            data: rows
        },
        useRowSelection,
        useSort,
        useExpanded
    );

    useEffect(() => {
        if (selection.length > 0) {
            const toRemove = selection.filter(s => paths.indexOf(s.path) === -1).map(s => s.path);
            if (toRemove.length > 0) {
                dispatch(reduxActions.removeSelectionAction(toRemove));
            }
        }
    }, [rows, selection, paths, dispatch]);

    useEffect(() => {
        if (isStructuredView) {
            toggleAllRowsExpanded(true);
        }
    }, [rows, isStructuredView, toggleAllRowsExpanded]);

    const doubleClickNavigation = node => {
        let newMode = mode;
        const actions = [];
        if (mode === Constants.mode.SEARCH) {
            if (node.path.indexOf('/files') > -1) {
                newMode = Constants.mode.MEDIA;
            } else if (node.path.indexOf('/contents') > -1) {
                newMode = Constants.mode.CONTENT_FOLDERS;
            } else {
                newMode = Constants.mode.PAGES;
            }

            actions.push(reduxActions.setModeAction(newMode));
        }

        actions.push(reduxActions.setOpenPathAction(node.path));
        actions.push(reduxActions.setPathAction(node.path));
        dispatch(batchActions(actions));
    };

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const typeSelector = mode === Constants.mode.PAGES && dataCounts ? <ContentTypeSelectorComp contentCount={dataCounts.contents} pagesCount={dataCounts.pages}/> : null;

    if (_.isEmpty(rows) && !isLoading) {
        if ((mode === 'search')) {
            return <EmptyTable columnSpan={allColumnData.length} t={t}/>;
        }

        return (
            <>
                {typeSelector}
                <ContentEmptyDropZone mode={mode} path={path}/>
            </>
        );
    }

    return (
        <>
            {typeSelector}
            <UploadTransformComponent uploadTargetComponent={ContentTableWrapper}
                                      uploadPath={path}
                                      mode={mode}
            >
                <Table aria-labelledby="tableTitle"
                       data-cm-role="table-content-list"
                       style={{width: '100%', minWidth: '1100px'}}
                       {...getTableProps()}
                >
                    <ContentListHeader headerGroups={headerGroups}/>
                    <TableBody {...getTableBodyProps()}>
                        {tableRows.map(row => {
                            prepareRow(row);
                            const rowProps = row.getRowProps();
                            const selectionProps = row.getToggleRowSelectedProps();
                            const node = row.original;

                            return (
                                <TableRow key={'row' + row.id}
                                          {...rowProps}
                                          data-cm-role="table-content-list-row"
                                          isHighlighted={selectionProps.checked}
                                          onClick={e => {
                                              console.log('Click', e);
                                          }}
                                          onDoubleClick={allowDoubleClickNavigation(
                                              node.primaryNodeType.name,
                                              node.subNodes ? node.subNodes.pageInfo.totalCount : null,
                                              () => doubleClickNavigation(node)
                                          )}
                                >
                                    {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </UploadTransformComponent>
            {(!isStructuredView || mode === Constants.mode.SEARCH || mode === Constants.mode.MEDIA) &&
            <TablePagination totalNumberOfRows={totalCount}
                             currentPage={pagination.currentPage + 1}
                             rowsPerPage={pagination.pageSize}
                             label={{
                                 rowsPerPage: t('jcontent:label.pagination.rowsPerPage'),
                                 of: t('jcontent:label.pagination.of')
                             }}
                             rowsPerPageOptions={[10, 25, 50, 100]}
                             onPageChange={page => dispatch(reduxActions.setCurrentPageAction(page))}
                             onRowsPerPageChange={size => dispatch(reduxActions.setPageSizeAction(size))}
            />}
        </>
    );
};

ContentTable.propTypes = {
    isContentNotFound: PropTypes.bool,
    isLoading: PropTypes.bool,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    dataCounts: PropTypes.object
};

export default ContentTable;
