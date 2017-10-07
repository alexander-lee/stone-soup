import {
    EDIT_MENU_SUCCESS,
    EDIT_MENU_ERROR,
    GET_MENU,
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
        case GET_MENU:
            let numServings = 0;
            action.menu.forEach(item => numServings += item.servings);
            return {
                ...state,
                menu: action.menu,
                numServings,
            };
        default:
            return state;
    }
}