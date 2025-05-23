import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'template-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>An eye icon is displayed by default when the image is hovered in preview mode. Use the <i>indicator</i> template for custom content.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" [preview]="true" alt="Image" width="250">
                <ng-template #indicator>
                    <i class="pi pi-search"></i>
                </ng-template>
                <ng-template #image>
                    <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" width="250" />
                </ng-template>
                <ng-template #preview let-style="style" let-previewCallback="previewCallback">
                    <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" [style]="style" (click)="previewCallback()" />
                </ng-template>
            </p-image>
        </div>
        <app-code [code]="code" selector="image-template-demo"></app-code>
    `
})
export class TemplateDoc {
    code: Code = {
        basic: `<p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" [preview]="true" alt="Image" width="250">
    <ng-template #indicator>
        <i class="pi pi-search"></i>
    </ng-template>
    <ng-template #image>
        <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" width="250" />
    </ng-template>
    <ng-template #preview let-style="style" let-previewCallback="previewCallback">
        <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" [style]="style" (click)="previewCallback()" />
    </ng-template>
</p-image>`,

        html: `<div class="card flex justify-center">
    <p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" [preview]="true" alt="Image" width="250">
        <ng-template #indicator>
            <i class="pi pi-search"></i>
        </ng-template>
        <ng-template #image>
            <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" width="250" />
        </ng-template>
        <ng-template #preview let-style="style" let-previewCallback="previewCallback">
            <img src="https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg" alt="image" [style]="style" (click)="previewCallback()" />
        </ng-template>
    </p-image>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'image-template-demo',
    templateUrl: './image-template-demo.html',
    standalone: true,
    imports: [ImageModule]
})
export class ImageTemplateDemo {}`
    };
}
