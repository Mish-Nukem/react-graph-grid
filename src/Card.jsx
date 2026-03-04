import { useState, useEffect } from 'react';
import { Images } from './Themes/Images';
import { FieldEdit } from './FieldEdit';
import { GridFEClass } from './GridFE';
// =================================================================================================================================================================
export function Card(props) {
    let card = null;

    const [gridState, setState] = useState({ grid: card, ind: 0 });

    card = gridState.grid;
    let needGetRows = false;
    if (!card || card.uid !== props.uid && props.uid != null) {
        card = null;
        if (props.findGrid) {
            card = props.findGrid(props);
        }
        card = card || new CardClass(props);
        needGetRows = !card.changedRow;
    }

    if (props.init) {
        props.init(card);
    }

    card.refreshState = function () {
        setState({ grid: card, ind: card.stateind++ });
    }

    useEffect(() => {
        card.setupEvents();

        if (needGetRows && card.selectedRow() == null) {

            card.getRows().then(
                rows => {
                    card.rows = rows;
                    card.afterGetRows();
                    card.refreshState();
                }
            );
        }
        else if (card.columns.length <= 0 && card.getColumns) {
            card.prepareColumns().then(() => card.refreshState());
        }

        return () => {
            card.clearEvents();

            if (card.graph && card.graph.nodeCount) {
                card.graph.nodeCount--;
            }
        }
    }, [card, needGetRows])

    return (card.render());
}
// =================================================================================================================================================================
export class CardClass extends GridFEClass {

    constructor(props) {
        super(props);

        const card = this;

        card.visible = true;

        card.allowEdit = props.allowEdit;
        card.isVisible = props.isVisible || card.isVisible;
        card.activeRow = props.activeRow || '';
        card.refreshState = card.refreshState || (() => { });

        card.reqInd = 0;
        card.changedRow = {};
        card.initialRow = props.cardRow;
        Object.assign(card.changedRow, card.initialRow);

        if (props.isNewRecord) {
            card.isNewRecord = true;
            card.setEditing(true);
        }

        card.cardButtons = [];
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    render() {
        const card = this;

        card.addCardButtons();
        card.buttons = card.cardButtons;

        return (
            <>
                <div className='graph-card-toolbar'
                    key={`cardToolbarDiv_${card.id}_`}
                    style={{ margin: '0 1em' }}
                >
                    {super.renderToolbar()}
                </div>
                <div className="graph-card-div"
                    key={`cardBodyDiv_${card.id}_`}
                >
                    {
                        card.columns.map((col) => { return card.renderField(col) })
                    }
                </div>
                {super.renderPopup()}
            </>
        )
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderField(col) {
        const card = this;

        if (col.visible == false) return <></>;

        const isLookup = col.type === 'lookup';
        let row = card.changedRow;
        let value = isLookup ? row[col.keyField] : row[col.name];
        value = value != null ? value : '';
        if (col.type == null) {
            col.type = '';
        }
        else if (isLookup) {
            col.grid = card;
        }

        return (
            <div className="graph-card-field"
                key={`cardLookupDiv_${card.id}_${col.id}_`}
                style={{ margin: '0 1em 0.5em 1em' }}
            >
                <span
                    key={`cardLookupTitle_${card.id}_${col.id}_`}
                    style={{ gridColumn: 'span 3', width: 'calc(100% - 4px)' }}
                >
                    {col.title || col.name}
                </span>
                <FieldEdit
                    keyPref={card.id + '_card_'}
                    column={col}
                    value={value}
                    text={row[col.name]}
                    findFieldEdit={() => { return col._fieldEditObj; }}
                    large={true}
                    level={card.level}
                    disabled={card.allowEdit == null || card.allowEdit != true}
                    init={
                        (fe) => {
                            if (card.isEditing() && !card.changedRow) {
                                card.changedRow = {};
                                Object.assign(card.changedRow, card.selectedRow());
                            }

                            row = !card.isEditing() ? card.selectedRow() : card.changedRow;

                            col._fieldEditObj = fe;
                            fe.value = isLookup ? row[col.keyField] : row[col.name];
                            fe.value = fe.value != null ? fe.value : '';

                            fe.text = row[col.name];
                        }
                    }
                    onChange={(e) => {
                        if (!card.changedRow) {
                            card.changedRow = {};
                            Object.assign(card.changedRow, card.selectedRow());
                        }

                        if (isLookup) {
                            card.changedRow[col.keyField] = e.value;
                            card.changedRow[col.name] = e.text;
                            if (!card.isEditing()) {
                                card.setEditing(true);
                            }
                            card.refreshState();
                        }
                        else {
                            card.changedRow[col.name] = e.value;
                            card.setEditing(true);
                            card.refreshState();
                        }
                    }}
                >
                </FieldEdit>
            </div>
        )

    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    addCardButtons() {
        const card = this;

        if (card._cardButtonsAdded) return;

        card._cardButtonsAdded = true;

        //card.cardButtons.push({
        //    id: card.cardButtons.length,
        //    name: 'edit',
        //    title: card.translate('Start edit'),
        //    label: images.edit ? '' : card.translate('Start edit'),
        //    click: (e) => card.startEditNode(e),
        //    img: images.edit
        //});

        card.cardButtons.push({
            id: card.cardButtons.length,
            name: 'commit',
            title: card.translate('Commit changes'),
            label: card.translate('Commit'),
            img: Images.images.commit,
            click: (e) => card.commitChangesNode(e),
            getDisabled: (e) => card.commitChangesNodeDisabled(e),
        });

        card.cardButtons.push({
            id: card.cardButtons.length,
            name: 'rollback',
            title: card.translate('Rollback changes'),
            label: card.translate('Rollback'),
            img: Images.images.rollback,
            click: (e) => {
                card.rollbackChangesNode(e);
                if (card.isNewRecord && card.close) card.close(e);
            },
            getDisabled: (e) => card.rollbackChangesNodeDisabled(e),
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    commitChangesNodeDisabled() {
        const card = this;
        if (!card.isEditing()) return true;

        let requiredColumnsFilled = true;

        for (let col of card.columns) {
            if (!col.required || col.readonly) continue;

            let val = card.changedRow[col.name];
            if (col.required && (val == null || val === '')) {
                requiredColumnsFilled = false;
                break;
            }
        }

        return !requiredColumnsFilled;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    rollbackChangesNodeDisabled() {
        const card = this;
        return !card.isEditing();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    saveRow(e) {
        const card = this;

        if (!card.isRowChanged(e.row, card.changedRow)) return new Promise(function (resolve) { resolve(true); });

        return new Promise(function (resolve) {
            //e.row = card.initialRow = e.changedRow;
            Object.assign(card.initialRow, card.changedRow);
            resolve(true);
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    commitChangesNode() {
        const card = this;
        card.saveRow({ row: card.initialRow, changedRow: card.changedRow }).then(
            () => {
                if (card.isNewRecord || !card.keyField) {
                    card.setEditing(false);
                    Object.assign(card.initialRow, card.changedRow);
                    card.refreshState();
                }
                else {
                    card.getRows().then(
                        rows => {
                            card.rows = rows;
                            card.changedRow = rows[0];
                            Object.assign(card.initialRow, card.changedRow);
                            card.setEditing(false);
                            card.afterGetRows();
                            card.refreshState();
                        }
                    );
                }
            }
        ).catch((message) => {
            Object.assign(card.changedRow, card.initialRow);
            card.refreshState();
            alert(message || 'Error!');
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    rollbackChangesNode() {
        const card = this;
        if (card.isNewRecord || !card.keyField) {
            card.changedRow = {};
            Object.assign(card.changedRow, card.initialRow);
            card.setEditing(false);
            card.refreshState();
        }
        else {
            card.getRows().then(
                rows => {
                    card.rows = rows;
                    card.changedRow = rows[0];
                    Object.assign(card.initialRow, card.changedRow);
                    card.setEditing(false);
                    card.afterGetRows();
                    card.refreshState();
                }
            );
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    selectedRow() {
        const card = this;
        return card.changedRow;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    getRows() {
        const card = this;

        return new Promise(function (resolve) {
            const res = [card.initialRow];
            card.totalRows = 1;
            resolve(res);
        });
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
}