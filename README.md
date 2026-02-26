# react-graph-grid

A React package containing a grid that can communicate with other grids through a connection graph

For all questions, please contact rmb@mail.ru

Installation

	npm install react-grpah-grid


Example

	import { GridFE } from '../../node_modules/react-graph-grid/src/GridFE';
	import TestData from '../../node_modules/react-graph-grid/src/Tests/TestData';

	...

	/*
	* assuming the API returns something like this:
	*   const rows = [
	*       {
	*         Id: 1,
	*         Name: 'Mikle',
	*		  SecondName: 'Razumtsev',
	*		  Date: '26/01/1979'
	*		  Comment: 'Me',
	*		  Hometown: 'Voronezh',
	*		  HometownId: 1,
	*       },
	*       {
	*         Id: 2,
	*         Name: 'Boris',
	*		  SecondName: 'Razumtsev',
	*		  Date: '14/06/1953'
	*		  Comment: 'Father',
	*		  Hometown: 'Grafskaya',
	*		  HometownId: 2,
	*       },
	*       {
	*         Id: 3,
	*         Name: 'Ilia',
	*		  SecondName: 'Razumtsev',
	*		  Date: '16/09/1980'
	*		  Comment: 'Brother',
	*		  Hometown: 'Pskov',
	*		  HometownId: 4,
	*       },
	*     ]
	*
	*
	*	e.params = [
	*		{ key: 'pageSize', value: 10 },
	*		{ key: 'pageNumber', value: 1 }
	*   ]
	*
	*/

	    function loadRows(e) {
			return new Promise(function (resolve, reject) {
                const fetchParams = {
                    mode: 'cors',
                    method: 'post',
                    headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(e.params)
                };

				fetch(`/awesome-api-url/`, fetchParams).then(
					(response) => {
						resolve(response.json());
					}
				)
				.catch(error => {
					reject(error);
				});
		    });
		};

		function loadColumns() {
			return [
				{ name: 'Id', sortable: true, filtrable: true },
				{ name: 'Name', sortable: true, filtrable: true },
				{ name: 'SecondName', sortable: true, filtrable: true },
				{ name: 'Date', sortable: true },
				{ name: 'Comment', sortable: true, filtrable: true },
				{ name: 'HometownId', visible: false },
				{
					name: 'Hometown', 
					sortable: true, 
					filtrable: true, 
					type: 'lookup', 
					keyField: 'HometownId', 
					refKeyField: 'Id', 
					refNameField: 'City', 
					getRows: (e) => {
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
		};


		<GridFE 
			getRows={loadRows} 
			getColumns={loadColumns} 
			allowEditGrid={true}
		/>

Some grid properties

			uid - grid uid
			parentGrids - parent grids uids
			buttons - buttons array [{ id: 1, name: 'commit', title: 'Commit changes', label: 'Commit', img: Images.commit, click: (e) => grid.commitChanges(e), getDisabled: (e) => grid.commitChangesDisabled(e) }, ... ]
			multi - rows multiselect through a pocket
			renderCell - custom render grid cell
			getDefaultLinkContent - returns an object containing a data using when child grid responds to the parent grid active record
			pageSize - grid page size


For more examples see DebugApp.jsx

0.0.5 version

		"Adjust column visibility" option added to GridFE.jsx module

0.0.6 version

		Fixed GridFE.showColumnsSettings() function

0.0.7 version

		Fixed GridDB and its dropdown communication