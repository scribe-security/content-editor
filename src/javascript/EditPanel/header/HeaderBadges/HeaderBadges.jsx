import React from 'react';
import PropTypes from 'prop-types';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {UnsavedChip} from '~/EditPanel/header';
import {Constants} from '~/ContentEditor.constants';

const HeaderBadges = ({mode}) => (
    <div>
        {mode === Constants.routes.baseEditRoute && <PublicationInfoBadge/>}
        {mode === Constants.routes.baseEditRoute && <LockInfoBadge/>}
        <WipInfoChip/>
        {mode === Constants.routes.baseEditRoute && <UnsavedChip/>}
    </div>
);

HeaderBadges.propTypes = {
    mode: PropTypes.string.isRequired
};

export default HeaderBadges;
