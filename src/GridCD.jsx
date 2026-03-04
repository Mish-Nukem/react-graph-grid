/* eslint-disable no-mixed-operators */
import { useState, useEffect } from 'react';
import { GridFEClass } from './GridFE';
import { Card } from './Card'; 
// ==================================================================================================================================================================
export function GridCD(props) {
    let grid = null;

    const [gridState, setState] = useState({ grid: grid, ind: 0 });

    grid = gridState.grid;
    let needGetRows = false;
    if (!grid || grid.uid !== props.uid && props.uid != null) {
        grid = null;
        if (props.findGrid) {
            grid = props.findGrid(props);
        }
        grid = grid || new GridCDClass(props);
        needGetRows = !props.noAutoRefresh && !grid.hasVisibleParentGrids();
    }

    if (props.init) {
        props.init(grid);
    }

    grid.refreshState = function () {
        setState({ grid: grid, ind: grid.stateind++ });
    }

    useEffect(() => {
        grid.setupEvents();

        if (needGetRows && (grid.rows.length <= 0 || grid.columns.length <= 0) || grid._forceRefresh) {

            grid._forceRefresh = false;

            grid._waitingRows = true;
            grid.getRows({ filters: grid.collectFilters(), grid: grid }).then(
                rows => {
                    grid.rows = rows;
                    grid.afterGetRows();
                    grid.refreshState();
                }
            ).finally(() => {
                grid._waitingRows = false;
                grid.refreshState();
            });
        }
        else if (grid.columns.length <= 0 && grid.getColumns) {
            grid.prepareColumns().then(() => grid.refreshState());;
        }

        return () => {
            grid.clearEvents();
        }
    }, [grid, needGetRows])

    return (grid.render());
}

// ==================================================================================================================================================================
export class GridCDClass extends GridFEClass {

    constructor(props) {
        super(props);

        const grid = this;
        grid.allowView = true;

        grid._buttonsDict['view'].getVisible = () => { return true; };
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    render() {
        return (
            <>
                {super.render()}
            </>
        )
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderPopupContent(wnd) {
        const grid = this;
        return grid.cardIsShowing ? grid.renderCardContent(wnd) : super.renderPopupContent(wnd);
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderCardContent() {
        const grid = this;
        return (
            grid.allowView == false ?
                <div
                    className={`graph-filter-title graph-filter-required`}
                >
                    {grid.translate('Insufficient rights to view')}
                </div>
                :
                <Card
                    cardRow={grid.cardRow || {}}
                    isNewRecord={grid.isNewRecord}
                    allowEdit={grid.allowEdit}
                    uid={(grid.uid || grid.id) + '_card_'}
                    keyField={grid.keyField}
                    level={grid.level + 1}
                    findGrid={() => {
                        const selRow = grid.cardRow || grid.selectedRow();
                        if (grid._card && selRow && grid._card.changedRow[grid.keyField] === selRow[grid.keyField]) {
                            return grid._card;
                        }
                    }}
                    init={(card) => {
                        if (grid._card == card) return;

                        grid._card = card;

                        card.visible = true;
                        card.columns = [];
                        for (let col of grid.columns) {
                            const remGetRows = col.getRows;
                            delete col._fieldEditObj;
                            delete col.grid;
                            delete col._filterEditObj;
                            delete col.getRows;

                            // WARNING !!! потенциальная ошибка, если пользователь в потомке напихает в колонку объектов или функций !!!
                            let clone = structuredClone(col);
                            card.columns.push(clone);

                            clone.getRows = col.getRows = remGetRows;

                            col.grid = grid;
                        }
                        card.close = (e) => {
                            grid.onClosePopup(e);
                            grid.refreshState();
                        }
                    }}
                >
                </Card>
        );
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    viewRecord(e) {
        const grid = this;

        const shift = (grid.level + 1) * 20;

        grid.cardPos = grid.cardPos || { x: 100 + shift, y: 100 + shift, w: 800, h: 600 };
        grid.popupPos = grid.cardPos;

        grid.cardRow = grid.selectedRow();
        grid.isNewRecord = false;
        grid.cardIsShowing = true;
        grid.popupIsShowing = true;
        grid.popupTitle = grid.title;

        grid.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onClosePopup(e) {
        const grid = this;

        if (grid.cardIsShowing && grid._card) {
            if (grid._card.isEditing() && (grid.isNewRecord || grid.isRowChanged(grid._card.changedRow, grid.selectedRow()))) {
                e.cancel = !confirm(grid.translate('The row is changed. Discard changes?'));
                if (e.cancel) {
                    return;
                }
            }
            delete grid._card;
        }

        super.onClosePopup(e);

        if (e.cancel) return;

        if (grid.cardIsShowing) {
            grid.cardIsShowing = false;
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
}