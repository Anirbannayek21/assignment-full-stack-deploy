export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload
    }

    return state
}

export const initialState = false;

export const reducer1 = (role, action) => {
    if (action.type === "admin") {
        return action.payload
    }

    return role
}

export const initialState1 = false;