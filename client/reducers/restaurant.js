import {
    EDIT_MENU_SUCCESS,
    EDIT_MENU_ERROR
} from '../actions/restaurant-actions.js';

export default function(state = {}, action) {
    switch(action.type) {
        case EDIT_MENU_SUCCESS:
            return {
                ...state,
                isEditSuccessful: true,
            };
        case EDIT_MENU_ERROR:
            return {
                ...state,
                isEditSuccessful: false,
            };
        default:
            return state;
    }
}