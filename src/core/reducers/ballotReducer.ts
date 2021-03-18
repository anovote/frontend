export type State = {
    selected: number
    selection: {
        single: number | null
        multiple: number[]
    }
}

export type Action =
    | { type: 'select'; payload: { single: number | null; multiple: number[] } }
    | { type: 'deselect'; payload: { single: null; multiple: number[] } }
    | { type: 'reset'; payload: { single: 0; multiple: [] } }

export const reducer = (state: State, action: Action): State => {
    const newState = Object.assign({}, state)

    const selection = action.payload
    newState.selection = selection

    switch (action.type) {
        /**
         * Updates the selected count
         * If the selection is a ballot with only one selection possible,
         * the increment will not increment the selected count
         */
        case 'select':
            {
                if (selection.single) {
                    let singleSelected = state.selected
                    if (singleSelected != 1) {
                        singleSelected = state.selected + 1
                    }
                    newState.selected = singleSelected
                } else {
                    const selected = state.selected + 1
                    newState.selected = selected
                }
            }
            break
        case 'deselect':
            {
                const selected = state.selected - 1
                newState.selected = selected
            }
            break
        case 'reset':
            {
                newState.selected = 0
            }
            break
        default:
    }
    return newState
}
