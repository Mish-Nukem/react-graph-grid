# react-graph-grid

A React package containing a grid that can communicate with other grids through a connection graph

For all questions, please contact rmb@mail.ru

## Installation

    npm install react-grpah-grid


## Example

	import { GridCD, TestData } from 'react-grpah-grid';
	
	...

	/*
	* assuming the API returns something like this:
	*   const rows = [
	*       {
	*         Id: 1,
	*         Name: 'Mikle',
	*		  SecondName: 'Razumtsev',
	*		  Date: '26/01/1979',
	*		  Comment: 'Me',
	*		  Hometown: 'Voronezh',
	*		  HometownId: 1,
	*       },
	*       {
	*         Id: 2,
	*         Name: 'Boris',
	*		  SecondName: 'Razumtsev',
	*		  Date: '14/06/1953',
	*		  Comment: 'Father',
	*		  Hometown: 'Grafskaya',
	*		  HometownId: 2,
	*       },
	*       {
	*         Id: 3,
	*         Name: 'Ilia',
	*		  SecondName: 'Razumtsev',
	*		  Date: '16/09/1980',
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


	<GridCD 
		getRows={loadRows} 
		getColumns={loadColumns} 
		allowEdit={true}
	/>

## Some grid properties

	uid - grid uid
	keyField - primary key
	nameField - name field
	parentGrids - parent grids uids
	buttons - buttons array 
				[
					{ 
						id: 1, 
						name: 'commit', 
						title: 'Commit changes', 
						label: 'Commit', 
						img: Images.commit, 
						click: (e) => grid.commitChanges(e), 
						getDisabled: (e) => grid.commitChangesDisabled(e) 
					},
					... 
				]
	multi - rows multiselect through a pocket
	renderCell - custom render grid cell
	pageSize - grid page size
	applyConnection - Returns the condition applied to the grid when the active record 
						of the parent grid changes.
						This condition can be passed to your controller to process 
						the condition of the relationship of the child table with the parent							  

						For example 
						applyConnection(e) {
							if (e.parent) {
								return `ChildTable.parentID in (${e.parent.selectedValue()})`;
							}
						}


## For more examples see DebugApp.jsx

	Your App.jsx should look like this

	import { DebugApp } from 'react-graph-grid';
	import 'react-graph-grid/src/css/default.css';

	function App() {
	  return (
		  <>
			  <DebugApp></DebugApp>
		</>
	  )
	}

	export default App


0.1.12 version
		
		readme and css changes

0.1.4 - 0.1.11 version

		package.json changes
		
0.1.3 version
		
		index.js containing exports added

0.1.2 version
		
		Grid date format fix

0.1.1 version
		
		Readme file updated

0.1.0 version

		Removed getDefaultLinkContent, added applyConnection function

0.0.7 version

		Fixed GridDB and its dropdown communication

0.0.6 version

		Fixed GridFE.showColumnsSettings() function

0.0.5 version

		"Adjust column visibility" option added to GridFE.jsx module