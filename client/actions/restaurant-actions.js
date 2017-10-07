import fetcher from '../utils/fetcher';

export const EDIT_MENU_SUCCESS = 'EDIT_MENU_SUCCESS';
export const EDIT_MENU_ERROR = 'EDIT_MENU_ERROR';

export function editMenu(id, menu) {
    return async function(dispatch, getState) {

        console.log(menu)
        const response = await fetcher.put(`/api/restaurant/edit/${id}`, { menu });

        console.log(response);

        if (response.status === 200) {
            dispatch({ type: EDIT_MENU_SUCCESS });
        } else {
            dispatch({type: EDIT_MENU_ERROR });
        }
    }
}