export const defineStore = (reducer, initialState) => {
    let state = initialState;

    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);
    };

    return { getState, dispatch };
};
