class setActions {
    
    type(type = 'null', x = 0) {
        this[type] = type;
        return {
            type: type,
            peyload: x
        }
    }
}
const Actions = new setActions();

export default Actions;



