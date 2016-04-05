import {OnInit, Component} from 'angular2/core';
import {UtilisateurService} from './utilisateur.service';
import {Utilisateur} from './utilisateur';
import {Router} from 'angular2/router';
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';

@Component({
    selector: 'sg-utilisateurs',
    templateUrl: 'app/components/utilisateurs/utilisateurs-list.html',
    styleUrls: ['app/components/utilisateurs/_utilisateurs-list.scss'],
    directives: [AgGridNg2],
    providers: [UtilisateurService],
    pipes: []
})
export class UtilisateursListComponent implements OnInit {

    errorMessage:string;
    heroes: Utilisateur[] = [];


    private gridOptions:GridOptions;
    private showGrid:boolean;
    private rowData:any[];
    private columnDefs:any[];
    private rowCount:string;

    constructor(private router:Router,
                private heroService:UtilisateurService) {
    }

    ngOnInit() {
        this.heroService.getUtilisateurs()
            .subscribe(
                res => {
                    this.rowData = res._embedded.utilisateurs.map(hero => {
                        hero.name = `${hero.firstName} ${hero.lastName}`;
                        hero.country = hero.pays.libelle;
                        hero.skills = hero.skill.map(skill => {
                            return skill.libelle;
                        }).join(', ');
                        hero.mobile = hero.numero;

                        return hero;
                    });
                },
                error => this.errorMessage = <any>error);

        this.gridOptions = <GridOptions>{};
        // this.createRowData();n
        this.createColumnDefs();
        this.showGrid = true;
    }

    addUtilisateur() {
        this.router.navigate(['UtilisateursNew']);
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
                suppressMenu: true, pinned: true
            },
            {
                headerName: 'Utilisateurs',
                children: [
                    {
                        headerName: 'Nom', field: 'name',
                        width: 150, pinned: true
                    },
                    {
                        headerName: 'Pays', field: 'country', width: 150,
                        cellRenderer: countryCellRenderer, pinned: true,
                        filterParams: {cellRenderer: countryCellRenderer, cellHeight: 20}
                    },
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {headerName: 'Skills', field: 'skills', width: 125, suppressSorting: true},
                    {
                        headerName: 'Proficiency', field: 'proficiency', width: 120,
                        cellRenderer: percentCellRenderer
                    }
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {headerName: 'Mobile', field: 'mobile', width: 150, filter: 'text'},
                    {headerName: 'Email', field: 'email', width: 150, filter: 'text'},
                    {headerName: 'Address', field: 'address', width: 500, filter: 'text'}
                ]
            }
        ];
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            const model = this.gridOptions.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    private onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    private onReady() {
        console.log('onReady');
        this.calculateRowCount();
    }

    private onCellClicked($event) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellValueChanged($event) {
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
    }

    private onCellDoubleClicked($event) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellContextMenu($event) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellFocused($event) {
        console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    private onRowSelected($event) {
        console.log('onRowSelected: ' + $event.node.data.name);
    }


    private onFilterModified() {
        console.log('onFilterModified');
    }

    private onBeforeSortChanged() {
        console.log('onBeforeSortChanged');
    }

    private onAfterSortChanged() {
        console.log('onAfterSortChanged');
    }


    private onRowClicked($event) {
        console.log('onRowClicked: ' + $event.node.data.name);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log('onColumnEvent: ' + $event);
    }

}

    function countryCellRenderer(params) {
        return params.value;
    }

    function percentCellRenderer(params) {
        const value = params.value;

        const eDivPercentBar = document.createElement('div');
        eDivPercentBar.className = 'div-percent-bar';
        eDivPercentBar.style.width = value + '%';
        if (value < 20) {
            eDivPercentBar.style.backgroundColor = 'red';
        } else if (value < 60) {
            eDivPercentBar.style.backgroundColor = '#ff9900';
        } else {
            eDivPercentBar.style.backgroundColor = '#00A000';
        }

        let eValue = document.createElement('div');
        eValue.className = 'div-percent-value';
        eValue.innerHTML = value + '%';

        let eOuterDiv = document.createElement('div');
        eOuterDiv.className = 'div-outer-div';
        // eOuterDiv.appendChild(eValue);
        // eOuterDiv.appendChild(eDivPercentBar);

        return eOuterDiv;
    }
}
