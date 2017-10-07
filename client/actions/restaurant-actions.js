import fetcher from '../utils/fetcher';

export const EDIT_MENU_SUCCESS = 'EDIT_MENU_SUCCESS';
export const EDIT_MENU_ERROR = 'EDIT_MENU_ERROR';
export const GET_MENU = 'GET_MENU';

export function editMenu(id, menu) {
  return async function(dispatch, getState) {
    const response = await fetcher.put(`/api/restaurant/edit/${id}`, { menu });
    // Should only return true if we our request was successful
    const { restaurant } = response;
    if (restaurant._id) {
      dispatch({ type: EDIT_MENU_SUCCESS });
    } else {
      dispatch({type: EDIT_MENU_ERROR });
    }
  }
}

export const getMenu = (id) => {
  return async (dispatch, getState) => {
    const response = await fetcher.get(`/api/restaurant/menu/${id}`);
    console.log(response);

    dispatch({
      type: GET_MENU,
      menu: response.menu,
    });
  };
};
