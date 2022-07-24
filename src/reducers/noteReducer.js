export const noteReducer = (state = [], action) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];

    case "delete":
      return state.filter((note) => note.id !== action.payload);

    case "update":
      return state.map((note) =>
        note.id === action.payload.id ? action.payload : note
      );

    default:
      return state;
  }
};
