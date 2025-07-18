import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'animation-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Transition of the animations can be customized using the <i>showTransitionOptions</i>, <i>hideTransitionOptions</i>, <i>showTransformOptions</i> and <i>hideTransformOptions</i> properties.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-toast [showTransitionOptions]="'250ms'" [showTransformOptions]="'translateX(100%)'" [hideTransitionOptions]="'150ms'" [hideTransformOptions]="'translateX(100%)'" />
            <p-button (click)="show()" label="Show" />
        </div>
        <app-code [code]="code" selector="toast-animation-demo"></app-code>
    `,
    providers: [MessageService]
})
export class AnimationDoc {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

    code: Code = {
        basic: `<p-toast [showTransitionOptions]="'250ms'" [showTransformOptions]="'translateX(100%)'" [hideTransitionOptions]="'150ms'" [hideTransformOptions]="'translateX(100%)'" />
<p-button (click)="show()" label="Show" />`,
        html: `<div class="card flex justify-center">
    <p-toast [showTransitionOptions]="'250ms'" [showTransformOptions]="'translateX(100%)'" [hideTransitionOptions]="'150ms'" [hideTransformOptions]="'translateX(100%)'" />
    <p-button (click)="show()" label="Show" />
</div>`,
        typescript: `import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'toast-animation-demo',
    templateUrl: './toast-animation-demo.html',
    standalone: true,
    imports: [ToastModule, ButtonModule],
    providers: [MessageService]
})
export class ToastAnimationDemo {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }
}`
    };
}
