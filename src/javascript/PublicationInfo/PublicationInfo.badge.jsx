import React from 'react';
import {withStyles} from '@material-ui/core';
import {usePublicationInfoContext} from './PublicationInfo.context';
import {compose} from 'react-apollo';
import * as PropTypes from 'prop-types';
import {Badge} from '@jahia/design-system-kit';
import {translate} from 'react-i18next';

const styles = () => ({
    root: {
        position: 'absolute',
        marginTop: '47px',
        marginLeft: '-58px'
    }
});

export const PublicationInfoBadge = ({classes, t}) => {
    const {publicationInfoPolling} = usePublicationInfoContext();
    return (
        <>
            {publicationInfoPolling && <Badge classes={classes}
                                              badgeContent={t('content-editor:label.contentEditor.edit.action.publish.badge')}
                                              variant="normal"
                                              color="info"
            />}
        </>
    );
};

PublicationInfoBadge.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(PublicationInfoBadge);
