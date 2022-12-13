import { combineReducers } from 'redux';
import main from './reducers/main';
import notify from './reducers/notification';
import sign from './reducers/sign';
import posts from './reducers/posts';
import profile from './reducers/profile';
import team from './reducers/team';
import socket from './reducers/socket';
import modal from './reducers/modalize';
const MainReducer = combineReducers({
    main,
    notify,
    sign,
    posts,
    profile,
    team,
    socket,
    modal
});

export default MainReducer;