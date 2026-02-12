/* eslint-disable no-mixed-operators */
import { useState, useEffect } from 'react';
import { GridFLClass } from './GridFL';
import { FieldEdit } from './FieldEdit';
import { Images } from './Themes/Images';
import { Modal } from './Modal';
// ==================================================================================================================================================================
export function GridFE(props) {
    let grid = null;

    const [gridState, setState] = useState({ grid: grid, ind: 0 });

    grid = gridState.grid;
    let needGetRows = false;
    if (!grid || grid.uid !== props.uid && props.uid != null) {
        grid = null;
        if (props.findGrid) {
            grid = props.findGrid(props);
        }
        grid = grid || new GridFEClass(props);
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
export class GridFEClass extends GridFLClass {

    constructor(props) {
        super(props);

        const grid = this;

        grid.allowEditGrid = props.allowEditGrid;

        //grid.changedRow = {};

        grid.closeSelfWnd = grid.closeSelfWnd || (() => { });

        grid.onSelectValue = props.onSelectValue || (() => { });

        const shift = (grid.level + 1) * 20;
        grid.popupPos = { x: 100 + shift, y: 100 + shift, w: 800, h: 600 };

        grid.addToolbarButtons();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    render() {
        const grid = this;
        return (
            <>
                {super.render()}
                {grid.renderPopup()}
            </>
        )
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    isVisible() {
        return this.visible;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderPopup() {
        const grid = this;
        return (
            grid.popupIsShowing ?
                <Modal
                    title={grid.popupTitle}
                    level={grid.level + 1}
                    renderContent={(wnd) => { return grid.renderPopupContent(wnd) }}
                    dimensionsByContent={grid.popupDimensionsByContent}
                    pos={grid.popupPos}
                    closeWhenEscape={grid.popupCloseWhenEscape}
                    onClose={(e) => {
                        grid.onClosePopup(e);
                        grid.refreshState();
                    }}
                >
                </Modal>
                :
                <></>
        );
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onClosePopup() {
        const grid = this;
        grid.popupIsShowing = false;
        grid.popupCloseWhenEscape = false;
        grid.popupTitle = '';
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderPopupContent() {
        return <></>;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderCell(grid, col, row, selected) {
        if (!grid.allowEditGrid && !col.allowVerticalResize || !selected || grid.isDisabled()) return super.renderCell(grid, col, row);

        row = !grid.isEditing() || !grid.changedRow ? row : grid.changedRow;

        return <FieldEdit
            keyPref={grid.id + '_' + row[grid.keyField]}
            column={col}
            value={col.type === 'lookup' ? row[col.keyField] : row[col.name]}
            text={row[col.name]}
            findFieldEdit={() => { return col._fieldEditObj; }}
            selectH={'1.4em'}
            level={grid.level}
            init={
                (fe) => {
                    if (grid.isEditing() && !grid.changedRow) {
                        grid.changedRow = {};
                        Object.assign(grid.changedRow, grid.selectedRow());
                    }

                    fe.ownerGrid = grid;

                    const lrow = !grid.isEditing() ? grid.selectedRow() : grid.changedRow;

                    col._fieldEditObj = fe;
                    fe.value = col.type === 'lookup' ? lrow[col.keyField] : lrow[col.name];
                    fe.text = lrow[col.name];
                }
            }
            onChange={(e) => {
                if (!grid.changedRow) {
                    grid.changedRow = {};
                    Object.assign(grid.changedRow, grid.selectedRow());
                }

                if (col.type === 'lookup') {
                    grid.changedRow[col.keyField] = e.value;
                    grid.changedRow[col.name] = e.text;
                    if (!grid.isEditing()) {
                        grid.setEditing(true);
                        grid.refreshState();
                    }
                    e.fe.refreshState();
                }
                else {
                    grid.changedRow[col.name] = e.value;
                    if (!grid.isEditing()) {
                        grid.setEditing(true);
                        grid.refreshState();
                    }
                    else {
                        e.fe.refreshState();
                    }
                }
            }}
        >
        </FieldEdit>
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    addToolbarButtons() {
        const grid = this;

        //node.buttons.push({
        //    id: node.buttons.length,
        //    name: 'edit',
        //    title: node.translate('Start edit'),
        //    label: node.images.edit ? '' : node.translate('Start edit'),
        //    click: (e) => node.startEdit(e),
        //    img: node.images.edit
        //});

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'commit',
            title: grid.translate('Commit changes'),
            label: grid.translate('Commit'),
            img: Images.images.commit,
            click: (e) => grid.commitChanges(e),
            getDisabled: (e) => grid.commitChangesDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'rollback',
            title: grid.translate('Rollback changes'),
            label: grid.translate('Rollback'),
            img: Images.images.rollback,
            click: (e) => grid.rollbackChanges(e),
            getDisabled: (e) => grid.rollbackChangesDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'add',
            title: grid.translate('Add new record'),
            label: grid.translate('Add'),
            img: Images.images.addRecord,
            click: (e) => grid.addRecord(e),
            getDisabled: (e) => grid.addRecordDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'copy',
            title: grid.translate('Copy record'),
            label: grid.translate('Copy'),
            img: Images.images.copyRecord,
            click: (e) => grid.copyRecord(e),
            getDisabled: (e) => grid.copyRecordDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'delete',
            title: grid.translate('Delete record'),
            label: grid.translate('Delete'),
            img: Images.images.deleteRecord,
            click: (e) => grid.deleteRecord(e),
            getDisabled: (e) => grid.deleteRecordDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'view',
            title: grid.translate('View record'),
            label: grid.translate('View'),
            img: Images.images.viewRecord,
            click: (e) => grid.viewRecord(e),
            getDisabled: (e) => grid.viewRecordDisabled(e),
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'selectValue',
            title: grid.translate('Select value'),
            label: grid.translate('Select'),
            click: (e) => grid.selectRecord(e),
            img: Images.images.selectFilterValue,
            getDisabled: (e) => grid.selectRecordDisabled(e),
            getVisible: () => { return grid.isSelecting },
        });

        grid.buttons.push({
            id: grid.buttons.length,
            name: 'exit',
            title: grid.translate('Exit'),
            label: grid.translate('Exit'),
            click: (e) => grid.closeSelfWnd(e),
            img: Images.images.exit,
            getDisabled: (e) => grid.exitDisabled(e),
            getVisible: () => { return grid.isSelecting },
        });

        grid._buttonsDict = {};
        for (let btn of grid.buttons) {
            grid._buttonsDict[btn.name] = btn;
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    selectRecord(e) {
        const grid = this;
        const row = grid.selectedRow();
        delete grid._selectedRows;

        if (!grid.multi || !grid.pocketOpened) {
            e.value = row[grid.keyField];
            e.text = row[grid.nameField];
            e.values = [{ value: e.value, label: e.text }];
        }
        else {
            e.multi = true;
            if (Object.keys(grid._selectedRowsDict).length === 0) {
                grid._selectedRowsDict[row[grid.keyField]] = row;
            }

            const texts = [];
            e.value = grid.selectedValue();
            e.values = grid.selectedValues(texts);
            e.text = texts.join(', ');
        }

        grid.onSelectValue(e);
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onRowDblClick(e, row) {
        const grid = this;
        super.onRowDblClick(e, row);

        if (grid.isSelecting && !grid.multi && grid.onSelectValue) {
            const row = grid.selectedRow();
            e.value = row[grid.keyField];
            e.text = row[grid.nameField];
            grid.onSelectValue(e);
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    commitChanges(e) {
        const grid = this;

        const row = grid.selectedRow();

        grid.saveRow({ row: row, changedRow: grid.changedRow }).then(
            () => {
                grid.setEditing(false);
                Object.assign(row, grid.changedRow);
                delete grid.changedRow;
                grid.refreshState();
            }
        ).catch((message) => {
            Object.assign(grid.changedRow, row);
            grid.refreshState();
            alert(message || 'Error!');
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    commitChangesDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.isEditing() || grid.isDisabled();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    rollbackChanges(e) {
        const grid = this;

        delete grid.changedRow;
        grid.setEditing(false);
        grid.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    rollbackChangesDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.isEditing() || grid.isDisabled();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    addRecord(e) {
        const grid = this;

        grid.getNewRow().then((newRow) => {
            grid.refreshState();
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    addRecordDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.allowAdd || grid.isEditing() || grid.isDisabled();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    copyRecord(e) {
        const grid = this;

        let newRow;
        Object.assign(newRow, grid.selectedRow());

        grid.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    copyRecordDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.allowCopy || grid.isEditing() || grid.isDisabled() || grid.selectedRowIndex == null || grid.selectedRowIndex < 0 || !grid.rows || grid.rows.length <= 0;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    deleteRecord(e) {
        const grid = this;

        if (window.confirm(grid.translate('Delete  record') + '?')) {
            grid.deleteRow(e).then(() => grid.refresh());
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    deleteRecordDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.allowDelete || grid.isEditing() || grid.isDisabled() || grid.selectedRowIndex == null || grid.selectedRowIndex < 0 || !grid.rows || grid.rows.length <= 0;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    viewRecord(e) {
        const grid = this;

        let cardRow = grid.selectedRow();

        grid.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    viewRecordDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.allowView || grid.isEditing() || grid.isDisabled() || grid.selectedRowIndex == null || grid.selectedRowIndex < 0 || !grid.rows || grid.rows.length <= 0;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    selectRecordDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.isSelecting || grid.isEditing() || grid.isDisabled() || grid.selectedRowIndex == null || grid.selectedRowIndex < 0 || !grid.rows || grid.rows.length <= 0;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    exitDisabled(e) {
        const grid = this;
        return grid._waitingRows || !grid.isSelecting || grid.isEditing() || grid.isDisabled();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onSelectedRowChanged(e) {
        const grid = this;
        super.onSelectedRowChanged(e);

        if (grid.allowEditGrid && grid.refreshState) {
            grid.refreshState();
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    getSelectedRowIndex() {
        const grid = this;
        if (grid.value == null || grid.value === '') return;

        let i = 0;
        for (let row of grid.rows) {
            if (row[grid.keyField] === grid.value) {
                grid.selectedRowIndex = i;
                break;
            }
            i++;
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    getGridMaxHeight() {
        const grid = this;
        return grid.frozenHeader ? grid.children && grid.children.length > 0 || grid.parents && grid.parents.length > 0 ? '40vh' : '80vh' : '';
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    async canLeaveRow(rowIndex) {
        const grid = this;
        let res;

        return (!grid.allowEditGrid || !grid.isEditing()) && !grid.isDisabled();

        const row = grid.rows[rowIndex];
        await grid.saveRow({ row: row, changedRow: grid.changedRow }).then(
            () => {
                grid.setEditing(false);
                Object.assign(row, grid.changedRow);
                delete grid.changedRow;
                grid.refreshState();
                res = true;
            }
        ).catch((message) => {
            Object.assign(grid.changedRow, row);
            grid.refreshState();
            res = false;
            alert(message || 'Error!');
        });

        return res;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    keyCellAdd(selected) {
        const grid = this;
        return selected ? '1' : grid.stateind;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    isRowChanged(row) {
        const grid = this;
        if (!grid.changedRow) return false;

        let res = false;
        for (let col in grid.changedRow) {
            if (grid.changedRow[col] !== row[col]) return true;
        }

        return res;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    saveRow(e) {
        const grid = this;

        if (!grid.isRowChanged(e.row)) return new Promise(function (resolve) { resolve(true); });

        return new Promise(function (resolve, reject) {
            e.row = e.changedRow;
            resolve(true);
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
}