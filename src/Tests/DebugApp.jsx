import { useState } from 'react';
import TestData from '../Tests/TestData';
import { Overlay } from '../Overlay';
import { Modal } from '../Modal';
import { Dropdown } from '../Dropdown';
import { Grid } from '../Grid';
import { GridGR } from '../GridGR';
import { GridDB } from '../GridDB';
import { GridFL } from '../GridFL';
//import { GridINU } from '../GridINU';
//import { GraphComponent } from '../GraphComponent';

function DebugApp() {
    const [state, setState] = useState({ menuItem: - 2 });

    window._logEnabled = true;

    const GetFamily = function (e) {
        return new Promise(function (resolve, reject) {

            const rows = new TestData().getFamily(e);

            if (rows != null) {
                resolve(rows);
            } else {
                reject(Error("Error getting rows"));
            }
        });
    };

    const GetButtons = function () {
        return [
            {
                id: 1,
                name: 'info',
                title: 'Persone Info',
                label: 'Persone Info',
                click: function (e) {
                    const selRow = e.grid.selectedRowIndex >= 0 && e.grid.rows.length > 0 ? e.grid.rows[e.grid.selectedRowIndex] : null;
                    if (!selRow) return;

                    alert(`Persone Name = ${selRow.Name}, Persone Birth Day = ${selRow.Date}`);
                },
                getDisabled: function (e) {
                    return !e.grid.rows || e.grid.rows.length <= 0;
                }
            },
            {
                id: 2,
                name: 'clear',
                title: 'Clear console',
                label: 'Clear console',
                click: function () {
                    console.clear();
                },
            }
        ]
    }

    const GetCities = function (e) {
        return new Promise(function (resolve, reject) {

            const rows = new TestData().getCity(e);

            if (rows != null) {
                resolve(rows);
            } else {
                reject(Error("Error getting rows"));
            }
        });
    };

    const GetCityColumns = function () {
        return new TestData().GetCityColumns();
    }

    const GetFamilyColumns = function () {
        return new TestData().GetFamilyColumns();
    }

    const ResetColumnsOrder = function () {
        const grid = window.gridComponent;
        if (!grid) return;

        grid.resetColumnsOrderToDefault();
    }

    const ResetColumnsWidths = function () {
        const grid = window.gridComponent;
        if (!grid) return;

        grid.resetColumnsWidthsToDefault();
    }

    const GetPopupItems = function () {
        return new Promise(function (resolve) {

            const items = [
                { id: 1, text: 'test 1 item' },
                { id: 2, text: 'test 2 item' },
                { id: 3, text: 'test 3 item' },
                { id: 4, text: 'test 4 item' },
                { id: 5, text: 'test 5 item' }
            ];
            resolve(items);
        });
    };

    const drawGridInModal = function () {
        return (
            <>
                <div className="div-on-menu">
                    <button onClick={() => { console.clear() }} className="modal-window-footer-button">Clear console</button>
                </div>
                <Grid getRows={GetFamily}
                    init={(grid) => { window.gridComponent = grid }}
                ></Grid>
            </>
        )
    }

    const drawDropdownInModal = function (wnd) {
        return (
            <>
                <div className="div-on-menu">
                    <button onClick={() => { console.clear() }} className="modal-window-footer-button">Clear console</button>
                    <button onClick={(e) => { wnd.ddComponent.popup(e); }} className="modal-window-footer-button">Show Dropdown</button>
                </div>
                <div>
                    {
                        wnd.ddComponent && wnd.ddComponent.clickedItem ? <span>{'Item Clicked : ' + wnd.ddComponent.clickedItem}</span> : <></>
                    }
                </div>
                <Dropdown init={(dd) => { wnd.ddComponent = dd; }} getItems={GetPopupItems}
                    onItemClick={(e) => { /*console.log('Item clicked: ' + e.itemId); */e.dropdown.clickedItem = e.itemId; wnd.refreshState(); }}
                >
                </Dropdown>
            </>
        )
    }

    const drawClearConsole = function () {
        return (
            <button onClick={() => { console.clear() }} className="modal-window-footer-button">Clear console</button>
        );
    }

    const drawTest = function () {
        return (<></>);
    }

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    const getTestApp = () => {
        console.log('state == ' + state.menuItem);
        switch (state.menuItem) {
            case 0:
                return <></>
            case 1:
                return (
                    <>
                        <div className="div-on-menu">
                            1. Drag column to reorder
                            2. Doubleclick on divider to autowidth
                        </div>
                        <div className="div-on-menu">
                            <button onClick={() => ResetColumnsOrder()} className="modal-window-footer-button">Reset columns order</button>
                            <button onClick={() => ResetColumnsWidths()} className="modal-window-footer-button">Reset columns widths</button>
                            {drawClearConsole()}
                        </div>
                        <Grid getRows={GetFamily} init={(grid) => { window.gridComponent = grid; }}></Grid>
                    </>
                )
            case 2:
                return (
                    <>
                        <div className="div-on-menu">
                            {drawClearConsole()}
                        </div>

                        <Overlay init={(ovl) => { window.overlayComponent = ovl }} closeWhenEscape={true} closeWhenClick={true}></Overlay>
                    </>
                )
            case 3:
                return (
                    <>
                        <Modal uid="m01" isModal={true} renderContent={() => { return drawGridInModal() }} closeWhenEscape={true}
                            pos={{ x: 100, y: 100, w: 600, h: 450 }} title='Modal Grid'></Modal>
                    </>
                )
            case 4:
                return (
                    <>
                        <Modal uid="m02" isModal={true} renderContent={(wnd) => { return drawDropdownInModal(wnd) }} closeWhenEscape={true}
                            dimensionsByContent={true}
                            pos={{ x: 100, y: 100, w: 300, h: 250 }}></Modal>
                    </>
                )
            case 5:
                return (
                    <>
                        <div className="div-on-menu">
                            {drawClearConsole()}
                        </div>
                        <div className="div-with-grid">
                            <GridGR uid="people" getRows={GetFamily}></GridGR>
                        </div>
                        <div className="div-with-grid">
                            <GridGR uid="cities" parentGrids="people" getRows={GetCities} getColumns={GetCityColumns}></GridGR>
                        </div>
                    </>
                );
            case 6:
                return (
                    <>
                        <div className="div-with-grid">
                            <GridDB getRows={GetFamily} buttons={GetButtons()} getColumns={GetFamilyColumns} multi={true}></GridDB>
                        </div>
                    </>
                );
            case 7:
                return (
                    <>
                        <div className="div-with-grid">
                            <GridFL getRows={GetFamily} buttons={GetButtons()} getColumns={GetFamilyColumns}></GridFL>
                        </div>
                    </>
                );
            case 11:
                return (
                    <>
                        {drawTest()}
                    </>
                );
            default:
                return null;
        }
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div >
            <select onChange={(e) => {
                //console.log('this == ' + e);
                setState({ menuItem: e.target.selectedIndex });
            }}>
                <option>0. None</option>
                <option>1. ReactGrid</option>
                <option>2. Overlay</option>
                <option>3. Modal</option>
                <option>4. Dropdown</option>
                <option>5. Two Grids</option>
                <option>6. GridDB</option>
                <option>7. GridFL</option>
                <option>11. TEST</option>
            </select>
            <div className="div-on-menu">
                {getTestApp()}
            </div>
        </div>
    );
}

export default DebugApp;