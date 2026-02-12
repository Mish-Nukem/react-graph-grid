import { GraphClass, WaveType } from '../Graph';
import { BaseComponent, NodeStatus, FilterType } from '../Base';
export default class TestData {

    //constructor() {
    //}

    getFamily(e) {
        e = e || { grid: {} };

        const family = [
            { Id: 1, ParentId: [3, 4], Name: 'Mikle', SecondName: 'Razumtsev', Date: '26/01/1979', Comment: 'Good boy', Hometown: 'Voronezh', HometownId: 1 },
            { Id: 2, ParentId: [0], Name: 'Nataly', SecondName: 'Sche..', Date: '15/01/1999', Comment: 'Good girl', Hometown: 'Hanty-Mansiysk', HometownId: 12 },
            { Id: 3, ParentId: [11, 23], Name: 'Lyuda', SecondName: 'Razumtseva', Date: '03/07/1953', Comment: 'Mommy', Hometown: 'Novosibirsk', HometownId: 8 }, 
            { Id: 4, ParentId: [5, 22], Name: 'Borya', SecondName: 'Razumtsev', Date: '14/06/1953', Comment: 'Papa', Hometown: 'Grafskaya', HometownId: 2 }, 
            { Id: 5, ParentId: [0], Name: 'Nina', SecondName: 'Razumtseva', Date: '17/06/1917', Comment: 'Babushka', Hometown: 'Ustyuzhna', HometownId: 9 },
            { Id: 6, ParentId: [3, 4], Name: 'Evgenia', SecondName: 'Batyreva', Date: '31/10/1974', Comment: 'Sister', Hometown: 'Voronezh', HometownId: 1 },
            { Id: 7, ParentId: [9, 10], Name: 'Ilia', SecondName: 'Razumtsev', Date: '16/09/1980', Comment: 'Brother 1', Hometown: 'Pskov', HometownId: 4 }, 
            { Id: 8, ParentId: [9, 10], Name: 'Mitka', SecondName: 'Razumtsev', Date: '04/07/1989', Comment: 'Brother 2', Hometown: 'Pskov', HometownId: 4 },
            { Id: 9, ParentId: [5, 22], Name: 'Kolya', SecondName: 'Razumtsev', Date: '02/11/1954', Comment: 'Dadya', Hometown: 'Grafskaya', HometownId: 2 },
            { Id: 10, ParentId: [11, 23], Name: 'Lara', SecondName: 'Razumtseva', Date: '31/01/1961', Comment: 'Tetya', Hometown: 'Elista', HometownId: 5 },
            { Id: 11, ParentId: [0], Name: 'Valya', SecondName: 'Mukhlynova', Date: '23/06/1933', Comment: 'Babushka', Hometown: 'Elista', HometownId: 5 },
            { Id: 12, ParentId: [6, 32], Name: 'Dashka', SecondName: 'Markelova', Date: '08/06/2000', Comment: 'Plemyannica 1', Hometown: 'Elista', HometownId: 5 },
            { Id: 13, ParentId: [6, 32], Name: 'Katka', SecondName: 'Markelova', Date: '27/05/2003', Comment: 'Plemyannica 2', Hometown: 'Elista', HometownId: 5 },
            { Id: 14, ParentId: [6, 31], Name: 'Tuyanka', SecondName: 'Batyreva', Date: '15/11/2010', Comment: 'Plemyannica 3', Hometown: 'Elista', HometownId: 5 },
            { Id: 15, ParentId: [0], Name: 'Shura', SecondName: 'Pelushskaya', Date: '22/04/1919', Comment: 'Dv. Babushka', Hometown: 'Ustyuzhna', HometownId: 9 },
            { Id: 16, ParentId: [15], Name: 'Ira', SecondName: 'Pelushskaya', Date: '11/06/1947', Comment: 'Dv. Tetya', Hometown: 'Pskov', HometownId: 4 },
            { Id: 17, ParentId: [11, 23], Name: 'Sveta', SecondName: 'Dolginova', Date: '10/11/195?', Comment: 'Tetya', Hometown: 'Novosibirsk', HometownId: 8 },
            { Id: 18, ParentId: [11, 23], Name: 'Rita', SecondName: 'Dolginova', Date: '23/10/195?', Comment: 'Tetya', Hometown: 'Novosibirsk', HometownId: 8 },
            { Id: 19, ParentId: [11, 23], Name: 'Nadya', SecondName: 'Shaula', Date: '11/11/196?', Comment: 'Tetya', Hometown: 'Novosibirsk', HometownId: 8 },
            { Id: 20, ParentId: [11, 23], Name: 'Vitia', SecondName: 'Dolginov', Date: '11/11/196?', Comment: 'Dadya', Hometown: 'Novosibirsk', HometownId: 8 },
            { Id: 21, ParentId: [11, 23], Name: 'Tanya', SecondName: 'Dolginova', Date: '07/01/1963', Comment: 'Tetya', Hometown: 'Elista', HometownId: 5 },
            { Id: 22, ParentId: [0], Name: 'Misha', SecondName: 'Razumtsev', Date: '??/??/19??', Comment: 'Ded', Hometown: 'Grafskaya', HometownId: 2 },
            { Id: 23, ParentId: [0], Name: 'Zambo', SecondName: 'Dolginov', Date: '??/??/19??', Comment: 'Ded 2', Hometown: 'Elista', HometownId: 5 },

            { Id: 24, ParentId: [18, 34], Name: 'Alina', SecondName: 'Ushakova', Date: '??/??/????', Comment: 'Dv. Sister', Hometown: 'Elista', HometownId: 5 },
            { Id: 25, ParentId: [19, 33], Name: 'Igor', SecondName: 'Shaula', Date: '??/??/????', Comment: 'Dv. Brother', Hometown: 'Energodar', HometownId: 14 },
            { Id: 26, ParentId: [19, 33], Name: 'Dima', SecondName: 'Shaula', Date: '??/??/????', Comment: 'Dv. Brother', Hometown: 'Energodar', HometownId: 14 },
            { Id: 27, ParentId: [20, 35], Name: 'Olga', SecondName: 'Dolginova', Date: '??/??/????', Comment: 'Dv. Sister', Hometown: 'Elista', HometownId: 5 },
            { Id: 28, ParentId: [20, 35], Name: 'Venia', SecondName: 'Dolginov', Date: '??/??/????', Comment: 'Dv. Brother', Hometown: 'Elista', HometownId: 5 },
            { Id: 29, ParentId: [20, 36], Name: 'Oleg', SecondName: 'Dolginov', Date: '??/??/????', Comment: 'Dv. Brother', Hometown: 'Elista', HometownId: 5 },

            { Id: 30, ParentId: [0], Name: 'Yura', SecondName: 'Pelushskiy', Date: '??/??/????', Comment: 'Dv. Ded', Hometown: 'Ustyuzhna', HometownId: 9 },
            { Id: 31, ParentId: [0], Name: 'Sanal', SecondName: 'Batyrev', Date: '11/06/????', Comment: 'Muzh Sestry 3', Hometown: 'Elista', HometownId: 5 },
            { Id: 32, ParentId: [0], Name: 'Dima', SecondName: 'Markelov', Date: '??/??/????', Comment: 'Muzh Sestry 2', Hometown: 'Elista', HometownId: 5 },
            { Id: 33, ParentId: [0], Name: 'Slava', SecondName: 'Shaula', Date: '??/??/????', Comment: 'Muzh Teti', Hometown: 'Energodar', HometownId: 14 },
            { Id: 34, ParentId: [0], Name: 'Sasha', SecondName: 'Ushakov', Date: '??/??/????', Comment: 'Muzh Teti', Hometown: 'Elista', HometownId: 5 },
            { Id: 35, ParentId: [0], Name: 'Toma', SecondName: '???', Date: '??/??/????', Comment: 'Mat Olgi i Veni', Hometown: 'Elista', HometownId: 5 },
            { Id: 36, ParentId: [0], Name: 'Ira', SecondName: '???', Date: '??/??/????', Comment: 'Mat Olega', Hometown: 'Elista', HometownId: 5 },
        ];

        if (e.autocompleteColumn) {
            e.grid._autocomplDict = {};
            e.grid._autocomplCount = 0;
        }

        let rows = [];

        for (let row of family) {
            if (!this.passRow(e.grid, row, e.autocompleteColumn)) continue;

            if (e.autocompleteColumn) {
                e.grid._autocomplCount++;
                if (e.grid._autocomplCount > 10) break;

                let cellValue = row[e.autocompleteColumn.name];
                e.grid._autocomplDict[String(cellValue).toLowerCase()] = 1;

                rows.push(cellValue);
            }
            else {
                rows.push(row);
            }
        }

        if (!e.autocompleteColumn) {
            e.grid.totalRows = rows.length;

            if (e.grid.columns) {
                let sortCol = null;
                for (let col of e.grid.columns) {
                    if (col.asc || col.desc) {
                        sortCol = col;
                        break;
                    }
                }

                if (sortCol != null) {
                    rows.sort(function (a, b) { return a[sortCol.name] > b[sortCol.name] ? (sortCol.asc ? 1 : -1) : (sortCol.asc ? -1 : 1); });
                }
            }
        }

        if (e.autocompleteColumn) {
            rows.sort(function (a, b) { return a > b ? 1 : -1; });
        }
        else {
            rows = e.grid.pageSize > 0 && e.grid.pageNumber > 0 ? rows.slice((e.grid.pageNumber - 1) * e.grid.pageSize, e.grid.pageNumber * e.grid.pageSize) : rows;

            e.grid.rows = rows;
        }

        return rows;
    }

    GetFamilyColumns() {
        return [
            { name: 'Id', sortable: true, filtrable: true },
            { name: 'Name', sortable: true, filtrable: true },
            { name: 'SecondName', sortable: true, filtrable: true },
            { name: 'Date', sortable: true },
            { name: 'Comment', sortable: true, filtrable: true },
            {
                name: 'Hometown', sortable: true, filtrable: true, type: 'lookup', keyField: 'HometownId', refKeyField: 'Id', refNameField: 'City', getRows: (e) => {
                    return new Promise(function (resolve, reject) {

                        const rows = new TestData().getCity(e);

                        if (rows != null) {
                            resolve(rows);
                        } else {
                            reject(Error("Error getting rows"));
                        }
                    });
                }
            },
        ]
    }

    getCity(e) {
        const cities = [
            { Id: 1, City: 'Voronezh', ParentId: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
            { Id: 2, City: 'Grafskaya', ParentId: [1, 3, 4, 5, 6, 7, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
            { Id: 3, City: 'Moskow', ParentId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 28, 29] },
            { Id: 4, City: 'Pskov', ParentId: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 30] },
            { Id: 5, City: 'Elista', ParentId: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29] },
            { Id: 6, City: 'Pyatigorsk', ParentId: [1, 3, 4, 6, 12, 13, 14] },
            { Id: 7, City: 'Piter', ParentId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16] },
            { Id: 8, City: 'Novosibirsk', ParentId: [1, 3, 4, 11, 14, 17, 18, 19, 20, 23] },
            { Id: 9, City: 'Ustyuzhna', ParentId: [5, 15, 30] },
            { Id: 10, City: 'Army', ParentId: [1, 7, 8, 9, 20] },
            { Id: 11, City: 'Bali', ParentId: [2] },
            { Id: 12, City: 'Hanty-Mansiysk', ParentId: [2] },
            { Id: 13, City: 'Paris', ParentId: [21] },
            { Id: 14, City: 'Energodar', ParentId: [19, 25, 26] },
        ];

        if (e.autocompleteColumn) {
            e.grid._autocomplDict = {};
            e.grid._autocomplCount = 0;
        }

        let rows = [];

        for (let row of cities) {
            if (!this.passRow(e.grid, row, e.autocompleteColumn)) continue;

            if (e.filters && e.filters.length) {
                let filter = e.filters[0];
                filter = filter.filter ? filter.filter : filter;
                if (!row['ParentId'] || row['ParentId'].indexOf(+filter) < 0) continue;
            }

            if (e.autocompleteColumn) {
                e.grid._autocomplCount++;
                if (e.grid._autocomplCount > 10) break;

                let cellValue = row[e.autocompleteColumn.name];
                e.grid._autocomplDict[String(cellValue).toLowerCase()] = 1;

                rows.push(cellValue);
            }
            else {
                rows.push(row);
            }
        }

        if (!e.autocompleteColumn && e.grid) {
            e.grid.totalRows = rows.length;

            if (e.grid.columns) {
                let sortCol = null;
                for (let col of e.grid.columns) {
                    if (col.asc || col.desc) {
                        sortCol = col;
                        break;
                    }
                }

                if (sortCol != null) {
                    rows.sort(function (a, b) { return a[sortCol.name] > b[sortCol.name] ? (sortCol.asc ? 1 : -1) : (sortCol.asc ? -1 : 1); });
                }
            }
        }

        if (e.autocompleteColumn) {
            rows.sort(function (a, b) { return a > b ? 1 : -1; });
        }
        else {
            rows = e.grid.pageSize > 0 && e.grid.pageNumber > 0 ? rows.slice((e.grid.pageNumber - 1) * e.grid.pageSize, e.grid.pageNumber * e.grid.pageSize) : rows;

            e.grid.rows = rows;
        }

        return rows;
    }

    GetCityColumns() {
        return [{ name: 'Id', sortable: true }, { name: 'City', sortable: true, filtrable: true }]
    }

    passRow(grid, row, autocompleteColumn) {
        if (!grid || !grid.columns) return true;

        for (let col of grid.columns) {
            if (!col.filtrable || (col.filter == null || col.filter == '') && !autocompleteColumn) continue;

            const cellValue = String(row[col.name]).toLowerCase();
            if (cellValue == '') return false;

            const filter = col.filter == null || col.filter == '' ? '' : col.filter.toLowerCase();

            if (filter != '') {
                if (autocompleteColumn) {
                    if (autocompleteColumn == col && cellValue.indexOf(filter) != 0 || autocompleteColumn != col && cellValue != filter) return false;

                }
                else {
                    if (cellValue != filter) return false;
                }
            }

            if (autocompleteColumn && grid._autocomplDict[cellValue]) return false;
        }

        return true;
    }

    GetCities = function (e) {
        return new Promise(function (resolve, reject) {

            const rows = new TestData().getCity(e);

            if (rows != null) {
                resolve(rows);
            } else {
                reject(Error("Error getting rows"));
            }
        });
    };
}