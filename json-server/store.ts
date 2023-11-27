export const defineStore = (reducer: any, initialState: any) => {
    let state = initialState;

    const getState = () => state;
    const dispatch = (action: any) => {
        state = reducer(state, action);
    };

    return { getState, dispatch };
};
