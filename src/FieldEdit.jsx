/* eslint-disable no-mixed-operators */
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BaseComponent } from './Base';
import { Modal } from './Modal';
import { Images } from './Themes/Images';
import { GridFE } from './GridFE';
export function FieldEdit(props) {
    let fe = null;

    const [feState, setState] = useState({ fe: fe, ind: 0 });

    fe = feState.fe;
    if (!fe) {
        if (props.findFieldEdit) {
            fe = props.findFieldEdit();
        }
        fe = fe || new FieldEditClass(props);
    }

    fe.textareaRef = useRef(null);

    fe.column = props.column;

    if (fe.value == null) {
        fe.value = props.value || '';
        fe.text = props.text || '';
    }

    fe.getFilters = props.getFilters;

    fe.multi = props.multi;

    fe.id = props.keyPref || FieldEditClass._seq++;

    fe.disabled = props.disabled;

    BaseComponent.theme = BaseComponent.theme || {};

    fe.buttonClass = props.buttonClass || BaseComponent.theme.filterButtonClass || '';
    fe.inputClass = props.inputClass || BaseComponent.theme.inputClass || '';
    fe.inputClassLG = props.inputClassLG || BaseComponent.theme.inputClassLG || '';
    fe.clearButtonClass = props.clearButtonClass || BaseComponent.theme.clearButtonClass || '';
    fe.selectClass = props.selectClass || BaseComponent.theme.selectClass || '';
    fe.divContainerClass = props.divContainerClass || '';

    fe.w = props.w;
    fe.maxW = props.maxW;
    fe.h = fe.h || props.h || '1.6em';
    fe.textareaH = props.textareaH || '2.1em';

    if (props.init) {
        props.init(fe);
    }

    fe.refreshState = function () {
        setState({ fe: fe, ind: fe.stateind++ });
    }

    useEffect(() => {
        return () => {
            if (fe._resizeObserver && fe._resizeObservedObj) {
                fe._resizeObserver.unobserve(fe._resizeObservedObj);
            }
        };
    }, [fe])

    useLayoutEffect(() => {
        if (fe.textareaRef.current && fe._refocus) {
            fe.textareaRef.current.focus();
            if (fe.selectionStart > 0) {
                fe.textareaRef.current.setSelectionRange(fe.selectionStart, fe.selectionStart);
            }
            fe._refocus = false;
        }

        const handleResize = () => {
            //console.log('Textarea resized. New height:', fe.textareaRef.current.offsetHeight);
            if (fe.textareaRef.current) {
                fe.h = fe.textareaRef.current.offsetHeight;
            }
        };

        if (fe.textareaRef.current && fe._resizeObserved !== fe.textareaRef.current) {
            fe._resizeObserver = new ResizeObserver(handleResize);

            if (fe._resizeObservedObj) {
                fe._resizeObserver.unobserve(fe._resizeObservedObj);
            }

            fe._resizeObservedObj = fe.textareaRef.current;

            fe._resizeObserver.observe(fe.textareaRef.current);
        }
    });

    return (fe.render());
}

// ==================================================================================================================================================================
export class FieldEditClass extends BaseComponent {

    constructor(props) {
        super(props);

        const fe = this;

        fe.stateind = 0;
        fe.id = props.keyPref || FieldEditClass._seq++;

        fe.onChange = props.onChange || (() => { });

        fe.selectionStart = 0;

        fe.large = props.large;

        // просто разметка 'span 2' etc.
        fe.gridColumn = props.gridColumn;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    static _seq = 0;
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    render() {
        const fe = this;

        return (
            <>
                <div
                    key={`fieldEditDiv_${fe.id}_${fe.column.id}_`}
                    className={fe.divContainerClass ? fe.divContainerClass : fe.large ? 'field-edit' : fe.column.type === 'lookup' && !fe.column.readonly ? 'grid-cell-lookup' : 'grid-cell-edit'}
                    style={{
                        border: 'none',
                        height: !fe.inputClass ? fe.h : '',
                        width: '100%',
                        display: 'grid',
                        gridColumn: fe.gridColumn || '',
                        gridTemplateColumns: fe.getDivGridTemplateColumns(),
                        maxWidth: fe.maxW ? fe.maxW : '',
                        minHeight: fe.large ? '2.5em' : '',
                        columnGap: fe.large ? '0.2em' : '',
                        alignItems: 'center',
                        justifyItems: 'center',
                    }}
                >
                    {
                        fe.renderInput()
                    }
                    {
                        fe.canClear() ?
                            <button
                                key={`fieldClearButton_${fe.id}_${fe.column.id}_`}
                                className={`${fe.large ? 'graph-filter-clear' : 'grid-cell-button'} ${fe.clearButtonClass || ''}`}
                                style={{ width: !fe.large ? '1.6em' : '', height: !fe.large ? '1.6em' : '' }}
                                onClick={(e) => {
                                    fe.onClearClick(e);
                                }}
                                disabled={fe.disabled}
                            >
                                {!fe.large ? '×' : Images.images.filterClear()}
                            </button>
                            :
                            <></>
                    }
                </div >
                {
                    fe.lookupIsShowing ?
                        <Modal
                            title={fe.column.title}
                            renderContent={(wnd) => { return fe.renderLookupGrid(wnd); }}
                            pos={fe.popupPos}
                            onClose={(e) => {
                                if (fe.grid) {
                                    delete fe.grid.value;
                                }
                                fe.closeLookupField();
                                fe.refreshState();
                            }}
                        >
                        </Modal>
                        :
                        <></>
                }
            </>
        )
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderInput() {
        const fe = this;

        const isLookup = fe.column.type === 'lookup';
        const noClear = !fe.canClear();

        return (
            <>
                {
                    isLookup && !fe.column.readonly ?
                        <>
                            <input
                                key={`fieldLookupTitle_${fe.id}_${fe.column.id}_`}
                                style={{
                                    width: '100%',
                                    gridColumn: noClear ? 'span 2' : 'span 1',
                                    overflowX: 'hidden',
                                    height: !fe.large ? '1.7em' : '2.2em',
                                    minHeight: !fe.inputClass ? fe.textareaH : fe.h,
                                    boxSizing: 'border-box',
                                }}
                                disabled={true}
                                className={fe.large ? fe.inputClassLG : fe.inputClass || ''}
                                value={fe.value == null || fe.value == '' ? '' : fe.text != null && fe.text !== '' ? fe.text : fe.value}
                            >
                            </input>
                            <button
                                key={`fieldLookupButton_${fe.id}_${fe.column.id}_`}
                                className={`${fe.large ? 'graph-filter-button' : 'grid-cell-button'} ${fe.clearButtonClass}`}
                                style={{ width: !fe.large ? '1.6em' : '', height: !fe.large ? '1.6em' : '' }}
                                onClick={(e) => {
                                    fe.openLookupField(e);
                                }}
                                disabled={fe.disabled}
                            >
                                {!fe.large ? '...' : Images.images.filterSelect()}
                            </button>
                        </>
                        :
                        <textarea
                            key={`fieldTextarea_${fe.id}_${fe.column.id}_`}
                            ref={fe.textareaRef}
                            className={`${fe.large ? fe.inputClassLG : fe.inputClass}`}
                            value={isLookup ? fe.text : fe.value || ''}
                            style={{
                                width: noClear ? 'calc(100% - 2px)' : '100%',
                                minHeight: !fe.inputClass ? fe.textareaH : fe.minH,
                                height: fe.h ? fe.h : !fe.large ? '1.7em' : '2.2em',
                                padding: '0',
                                boxSizing: 'border-box',
                                gridColumn: noClear ? 'span 3' : 'span 2',
                                resize: 'vertical',
                                overflowX: 'hidden',
                            }}
                            onChange={(e) => {
                                e.value = e.text = e.target.value;
                                fe.value = fe.text = e.target.value;
                                e.fe = fe;

                                fe.selectionStart = e.target.selectionStart;
                                fe._refocus = true;

                                fe.onChange(e);
                                fe.refreshState();
                            }}
                            disabled={fe.disabled || fe.column.readonly}
                        >
                        </textarea>
                }
            </>
        );
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderLookupGrid(wnd) {
        const fe = this;

        return (
            <GridFE
                getRows={fe.column.getRows}
                keyField={fe.column.refKeyField}
                nameField={fe.column.refNameField}
                activeRow={fe.value}
                multi={fe.multi}
                level={fe.level + 1}
                findGrid={() => { return fe.grid; }}
                onSelectValue={(e) => {
                    fe._selectedOptions = e.values || [];

                    fe.value = e.value;
                    fe.text = e.text;

                    e.fe = fe;

                    fe.closeLookupField();
                    fe.onChange(e);
                    fe.refreshState();
                }}
                init={(lookupGrid) => {
                    if (!lookupGrid.value || fe.value && fe.value !== lookupGrid.value) {
                        fe.onLookupGridInit(lookupGrid);

                        delete lookupGrid._selectedRows;
                        if (fe.value) {
                            lookupGrid._selectedRowsDict = {};
                            for (let opt of fe._selectedOptions) {
                                let fakeRow = {};
                                fakeRow[fe.column.refKeyField] = opt.value;
                                fakeRow[fe.column.refNameField] = opt.label;
                                lookupGrid._selectedRowsDict[opt.value] = fakeRow;
                            }
                        }
                    }

                    lookupGrid.closeSelfWnd = () => {
                        fe.closeLookupField();
                        fe.refreshState();
                    };
                }}
                onClose={() => {
                    fe.closeLookupField();
                }}
            >
            </GridFE>
        );
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    getDivGridTemplateColumns() {
        const fe = this;
        return fe.large ? 'calc(100% - 4.6em) 2.2em 2.2em' : 'calc(100% - 2.8em) 1.4em 1.4em';
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    canClear() {
        const fe = this;
        return !fe.column.required && !fe.column.readonly && (fe.multi || fe.value != null && fe.value !== '');
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onClearClick(e) {
        const fe = this;

        e.value = e.text = '';
        fe.value = fe.text = '';
        e.fe = fe;
        fe.onChange(e);
        fe.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    closeLookupField() {
        const fe = this;
        fe.lookupIsShowing = false;
        if (fe.ownerGrid) {
            fe.ownerGrid._clicksDisabled = false;
        }
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    openLookupField(e) {
        const fe = this;

        const shift = (fe.level + 1) * 20;

        fe.popupPos = fe.popupPos || { x: 100 + shift, y: 100 + shift, w: 1700, h: 900 };

        fe.lookupIsShowing = true;
        if (fe.ownerGrid) {
            fe.ownerGrid._clicksDisabled = true;
        }

        fe.refreshState();
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    onLookupGridInit(grid) {
        const fe = this;
        fe.grid = grid;
        grid.value = fe.value;
        grid.getSelectedRowIndex();

        if (fe.getFilters) {
            grid.collectFilters = fe.getFilters;
        }

        if (grid._lookupPrepared) return;

        grid._lookupPrepared = true;

        grid.visible = true;
        grid.title = fe.column.title;
        grid.isSelecting = true;
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
}