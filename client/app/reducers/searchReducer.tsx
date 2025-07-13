export const searchReducer = (state = {}, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, query: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, results: action.payload };
    default:
      return state;
  }
};
