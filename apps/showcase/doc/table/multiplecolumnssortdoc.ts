import { Code } from '@/domain/code';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
    selector: 'multiple-columns-sort-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Multiple columns can be sorted by defining <i>sortMode</i> as <i>multiple</i>. This mode requires metaKey (e.g. <i>⌘</i>) to be pressed when clicking a header.</p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }" sortMode="multiple">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="code" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Code
                                    <p-sortIcon field="code" />
                                </div>
                            </th>
                            <th pSortableColumn="name" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Name
                                    <p-sortIcon field="name" />
                                </div>
                            </th>
                            <th pSortableColumn="category" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Category
                                    <p-sortIcon field="category" />
                                </div>
                            </th>
                            <th pSortableColumn="quantity" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Quantity
                                    <p-sortIcon field="quantity" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.category }}</td>
                            <td>{{ product.quantity }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [code]="code" selector="table-multiple-columns-sort-demo" [extFiles]="extFiles"></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleColumnsSortDoc {
    products: Product[];

    constructor(
        private productService: ProductService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });
    }

    code: Code = {
        basic: `<p-table [value]="products1" [tableStyle]="{'min-width': '60rem'}">
    <ng-template #header>
        <tr>
            <th pSortableColumn="code" style="width:20%">
                <div class="flex items-center gap-2">
                    Code
                    <p-sortIcon field="code" />
                </div>
            </th>
            <th pSortableColumn="name" style="width:20%">
                <div class="flex items-center gap-2">
                    Name
                    <p-sortIcon field="name" />
                </div>
            </th>
            <th pSortableColumn="category" style="width:20%">
                <div class="flex items-center gap-2">
                    Category
                    <p-sortIcon field="category" />
                </div>
            </th>
            <th pSortableColumn="quantity" style="width:20%">
                <div class="flex items-center gap-2">
                    Quantity
                    <p-sortIcon field="quantity" />
                </div>
            </th>
        </tr>
    </ng-template>
    <ng-template #body let-product>
        <tr>
            <td>{{product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.quantity }}</td>
        </tr>
    </ng-template>
</p-table>`,
        html: `<div class="card">
    <p-table [value]="products1" [tableStyle]="{'min-width': '60rem'}">
        <ng-template #header>
            <tr>
                <th pSortableColumn="code" style="width:20%">
                    <div class="flex items-center gap-2">
                        Code
                        <p-sortIcon field="code" />
                    </div>
                </th>
                <th pSortableColumn="name" style="width:20%">
                    <div class="flex items-center gap-2">
                        Name
                        <p-sortIcon field="name" />
                    </div>
                </th>
                <th pSortableColumn="category" style="width:20%">
                    <div class="flex items-center gap-2">
                        Category
                        <p-sortIcon field="category" />
                    </div>
                </th>
                <th pSortableColumn="quantity" style="width:20%">
                    <div class="flex items-center gap-2">
                        Quantity
                        <p-sortIcon field="quantity" />
                    </div>
                </th>
            </tr>
        </ng-template>
        <ng-template #body let-product>
            <tr>
                <td>{{ product.code }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.quantity }}</td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
        typescript: `import { Component, OnInit } from '@angular/core';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'table-multiple-columns-sort-demo',
    templateUrl: 'table-multiple-columns-sort-demo.html',
    standalone: true,
    imports: [TableModule, CommonModule],
    providers: [ProductService]
})
export class TableSingleColumnsSortDemo implements OnInit {
    products: Product[];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });
    }
}`,
        data: `{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
...`,
        service: ['ProductService']
    };

    extFiles = [
        {
            path: 'src/domain/product.ts',
            content: `
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`
        }
    ];
}
