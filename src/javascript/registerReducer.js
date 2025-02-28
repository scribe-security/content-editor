import {createActions, handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

export const {ceToggleSections} = createActions('CE_TOGGLE_SECTIONS');
export const {ceSwitchLanguage} = createActions('CE_SWITCH_LANGUAGE');

export const COMBINED_REDUCERS_NAME = 'contenteditor';

export const DEFAULT_OPENED_SECTIONS = {content: true, listOrdering: true};
const ROUTER_REDUX_ACTION = '@@router/LOCATION_CHANGE';

const extractParamsFromUrl = pathname => {
    if (pathname.startsWith('/content-editor')) {
        let [, , language, mode, uuid] = pathname.split('/');
        return {language, mode, uuid};
    }

    return {language: '', mode: '', uuid: ''};
};

export const registerReducer = registry => {
    const toggleSections = handleActions({
        [ceToggleSections]: (state, action) => action.payload
    }, DEFAULT_OPENED_SECTIONS);

    const languageReducer = handleActions({
        [ceSwitchLanguage]: (state, action) => action.payload,
        [ROUTER_REDUX_ACTION]: (state, action) => action.payload.location.pathname.startsWith('/content-editor/') ? extractParamsFromUrl(action.payload.location.pathname).language : state
    }, '');

    registry.add('redux-reducer', 'ceToggleSections', {targets: [COMBINED_REDUCERS_NAME], reducer: toggleSections});
    registry.add('redux-reducer', 'ceLanguage', {targets: [COMBINED_REDUCERS_NAME], reducer: languageReducer});

    const reducersArray = registry.find({type: 'redux-reducer', target: COMBINED_REDUCERS_NAME});
    const reducerObj = {};
    reducersArray.forEach(r => {
        reducerObj[r.key] = r.reducer;
    });

    const ceReducer = combineReducers(reducerObj);

    registry.add('redux-reducer', COMBINED_REDUCERS_NAME, {targets: ['root'], reducer: ceReducer});
};
