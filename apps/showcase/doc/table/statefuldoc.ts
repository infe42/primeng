import { Code } from '@/domain/code';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
    selector: 'stateful-doc',
    standalone: false,
    template: ` <app-docsectiontext>
            <p>Stateful table allows keeping the state such as page, sort and filtering either at local storage or session storage so that when the page is visited again, table would render the data using the last settings.</p>
            <p>
                Change the state of the table e.g paginate, navigate away and then return to this table again to test this feature, the setting is set as <i>session</i> with the <i>stateStorage</i> property so that Table retains the state until the
                browser is closed. Other alternative is <i>local</i> referring to <i>localStorage</i> for an extended lifetime.
            </p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table
                    #dt1
                    [value]="customers"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                    selectionMode="single"
                    [(selection)]="selectedCustomers"
                    dataKey="id"
                    [tableStyle]="{ 'min-width': '50rem' }"
                    [rows]="5"
                    [paginator]="true"
                    stateStorage="session"
                    stateKey="statedemo-session"
                >
                    <ng-template #caption>
                        <p-iconfield iconPosition="left">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText type="text" [value]="dt1.filters['global']?.value" (input)="dt1.filterGlobal($event.target.value, 'contains')" placeholder="Global Search" />
                        </p-iconfield>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Name
                                    <p-sortIcon field="name" />
                                </div>
                            </th>
                            <th pSortableColumn="country.name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Country
                                    <p-sortIcon field="country.name" />
                                </div>
                            </th>
                            <th pSortableColumn="representative.name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Representative
                                    <p-sortIcon field="representative.name" />
                                </div>
                            </th>
                            <th pSortableColumn="status" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Status
                                    <p-sortIcon field="status" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr [pSelectableRow]="customer">
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                                </div>
                            </td>
                            <td>
                                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr [pSelectableRow]="customer">
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                            </td>
                            <td>
                                <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                            </td>
                            <td>
                                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template emptymessage>
                        <tr>
                            <td colspan="4">No customers found.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [code]="code" selector="table-stateful-demo" [extFiles]="extFiles"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatefulDoc {
    customers!: Customer[];

    selectedCustomers!: Customer;

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

    code: Code = {
        basic: `<p-table
    #dt1
    [value]="customers"
    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
    selectionMode="single"
    [(selection)]="selectedCustomers"
    dataKey="id"
    [tableStyle]="{ 'min-width': '50rem' }"
    [rows]="5"
    [paginator]="true"
    stateStorage="session"
    stateKey="statedemo-session"
>
    <ng-template #caption>
        <p-iconfield iconPosition="left">
            <p-inputicon>
                <i class="pi pi-search"></i>
            </p-inputicon>
            <input
                pInputText
                type="text"
                [value]="dt1.filters['global']?.value"
                (input)="dt1.filterGlobal($event.target.value, 'contains')"
                placeholder="Global Search"
            />
        </p-iconfield>
    </ng-template>
    <ng-template #header>
        <tr>
            <th pSortableColumn="name" style="width:25%">
                <div class="flex items-center gap-2">
                    Name
                    <p-sortIcon field="name" />
                </div>
            </th>
            <th pSortableColumn="country.name" style="width:25%">
                <div class="flex items-center gap-2">
                    Country
                    <p-sortIcon field="country.name" />
                </div>
            </th>
            <th pSortableColumn="representative.name" style="width:25%">
                <div class="flex items-center gap-2">
                    Representative
                    <p-sortIcon field="representative.name" />
                </div>
            </th>
            <th pSortableColumn="status" style="width:25%">
                <div class="flex items-center gap-2">
                    Status
                    <p-sortIcon field="status" />
                </div>
            </th>
        </tr>
    </ng-template>
    <ng-template #body let-customer>
        <tr [pSelectableRow]="customer">
            <td>
                {{ customer.name }}
            </td>
            <td>
                <div class="flex items-center gap-2">
                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                </div>
            </td>
            <td>
                <div class="flex items-center gap-2">
                    <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                </div>
            </td>
            <td>
                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
            </td>
        </tr>
    </ng-template>
    <ng-template #body let-customer>
        <tr [pSelectableRow]="customer">
            <td>
                {{ customer.name }}
            </td>
            <td>
                <img
                    src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                    [class]="'flag flag-' + customer.country.code"
                    style="width: 20px"
                />
                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
            </td>
            <td>
                <img
                    [alt]="customer.representative.name"
                    src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{
                        customer.representative.image
                    }}"
                    width="32"
                    style="vertical-align: middle"
                />
                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
            </td>
            <td>
                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
            </td>
        </tr>
    </ng-template>
    <ng-template emptymessage>
        <tr>
            <td colspan="4">No customers found.</td>
        </tr>
    </ng-template>
</p-table>`,
        html: `<div class="card">
    <p-table
        #dt1
        [value]="customers"
        [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
        selectionMode="single"
        [(selection)]="selectedCustomers"
        dataKey="id"
        [tableStyle]="{ 'min-width': '50rem' }"
        [rows]="5"
        [paginator]="true"
        stateStorage="session"
        stateKey="statedemo-session"
    >
        <ng-template #caption>
            <p-iconfield iconPosition="left">
                <p-inputicon>
                    <i class="pi pi-search"></i>
                </p-inputicon>
                <input
                    pInputText
                    type="text"
                    [value]="dt1.filters['global']?.value"
                    (input)="dt1.filterGlobal($event.target.value, 'contains')"
                    placeholder="Global Search"
                />
            </p-iconfield>
        </ng-template>
        <ng-template #header>
            <tr>
                <th pSortableColumn="name" style="width:25%">
                    <div class="flex items-center gap-2">
                        Name
                        <p-sortIcon field="name" />
                    </div>
                </th>
                <th pSortableColumn="country.name" style="width:25%">
                    <div class="flex items-center gap-2">
                        Country
                        <p-sortIcon field="country.name" />
                    </div>
                </th>
                <th pSortableColumn="representative.name" style="width:25%">
                    <div class="flex items-center gap-2">
                        Representative
                        <p-sortIcon field="representative.name" />
                    </div>
                </th>
                <th pSortableColumn="status" style="width:25%">
                    <div class="flex items-center gap-2">
                        Status
                        <p-sortIcon field="status" />
                    </div>
                </th>
            </tr>
        </ng-template>
        <ng-template #body let-customer>
            <tr [pSelectableRow]="customer">
                <td>
                    {{ customer.name }}
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                        <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                        <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                    </div>
                </td>
                <td>
                    <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                </td>
            </tr>
        </ng-template>
        <ng-template #body let-customer>
            <tr [pSelectableRow]="customer">
                <td>
                    {{ customer.name }}
                </td>
                <td>
                    <img
                        src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                        [class]="'flag flag-' + customer.country.code"
                        style="width: 20px"
                    />
                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                </td>
                <td>
                    <img
                        [alt]="customer.representative.name"
                        src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{
                            customer.representative.image
                        }}"
                        width="32"
                        style="vertical-align: middle"
                    />
                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                </td>
                <td>
                    <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                </td>
            </tr>
        </ng-template>
        <ng-template emptymessage>
            <tr>
                <td colspan="4">No customers found.</td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
        typescript: `import { Component, OnInit } from '@angular/core';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'table-stateful-demo',
    templateUrl: 'table-stateful-demo.html',
    standalone: true,
    imports: [TableModule, HttpClientModule, InputTextModule, Tag, IconField, InputIcon],
    providers: [CustomerService]
})
export class TableStatefulDemo implements OnInit{
    customers!: Customer[];

    selectedCustomers!: Customer;

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomersSmall().then((data) => (this.customers = data));
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}`,
        data: `{
    id: 1000,
    name: 'James Butt',
    country: {
        name: 'Algeria',
        code: 'dz'
    },
    company: 'Benton, John B Jr',
    date: '2015-09-13',
    status: 'unqualified',
    verified: true,
    activity: 17,
    representative: {
        name: 'Ioni Bowcher',
        image: 'ionibowcher.png'
    },
    balance: 70663
},
...`,
        service: ['CustomerService']
    };

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }

    loadDemoData() {
        this.customerService.getCustomersSmall().then((data) => {
            this.customers = data;
            this.cd.markForCheck();
        });
    }

    extFiles = [
        {
            path: 'src/domain/customer.ts',
            content: `
export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string | Date;
    status?: string;
    activity?: number;
    representative?: Representative;
    verified?: boolean;
    balance?: number;
}`
        }
    ];
}
