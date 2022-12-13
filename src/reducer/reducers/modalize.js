import Action from "../actions";
/////////////////////////////////////////////
const initState = {
    modalizeOutside: null,
    modalizeWithNav: null,
    currentModalOutside: null,
    currentModalWithNav: null,
    navigation: { navigate: () => { } }
};
/////////////////////////////////////////////
const modalizeReducer = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        /////////////////////////////////////
        case Action.setNavigateRef:
            return {
                ...newState,
                navigation: action.peyload
            }
        /////////////////////////////////////
        case Action.setModalizeOutside:
            return {
                ...newState,
                modalizeOutside: action.peyload
            }
        /////////////////////////////////////
        case Action.setCurrentModalOutside:
            action.peyload && newState.modalizeOutside.open();
            return {
                ...newState,
                currentModalOutside: action.peyload,
            }
        /////////////////////////////////////
        case Action.setModalizeWithNav:
            return {
                ...newState,
                modalizeWithNav: action.peyload
            }
        /////////////////////////////////////
        case Action.setCurrentModalWithNav:
            setTimeout(() => {
                action.peyload && newState.modalizeWithNav.open();
            });
            return {
                ...newState,
                currentModalWithNav: action.peyload,
            }
        default:
            return newState;
    }
}

export default modalizeReducer;