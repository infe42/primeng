import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, Input, NgModule, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find } from '@primeuix/utils';
import { SharedModule } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';
import { Subscription } from 'rxjs';
import { TerminalStyle } from './style/terminalstyle';
import { TerminalService } from './terminalservice';

/**
 * Terminal is a text based user interface.
 * @group Components
 */
@Component({
    selector: 'p-terminal',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedModule],
    template: `
        <div [class]="cx('welcomeMessage')" *ngIf="welcomeMessage">{{ welcomeMessage }}</div>
        <div [class]="cx('commandList')">
            <div [class]="cx('command')" *ngFor="let command of commands">
                <span [class]="cx('promptLabel')">{{ prompt }}</span>
                <span [class]="cx('commandValue')">{{ command.text }}</span>
                <div [class]="cx('commandResponse')" [attr.aria-live]="'polite'">{{ command.response }}</div>
            </div>
        </div>
        <div [class]="cx('prompt')">
            <span [class]="cx('promptLabel')">{{ prompt }}</span>
            <input #in type="text" [(ngModel)]="command" [class]="cx('promptValue')" autocomplete="off" (keydown)="handleCommand($event)" autofocus />
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TerminalStyle],
    host: {
        '[class]': "cn(cx('root'), styleClass)"
    }
})
export class Terminal extends BaseComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    /**
     * Initial text to display on terminal.
     * @group Props
     */
    @Input() welcomeMessage: string | undefined;
    /**
     * Prompt text for each command.
     * @group Props
     */
    @Input() prompt: string | undefined;
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;

    commands: any[] = [];

    command!: string;

    container!: Element;

    commandProcessed!: boolean;

    subscription: Subscription;

    _componentStyle = inject(TerminalStyle);

    @ViewChild('in') inputRef!: ElementRef<HTMLInputElement>;

    @HostListener('click')
    onHostClick() {
        this.focus(this.inputRef?.nativeElement);
    }

    constructor(public terminalService: TerminalService) {
        super();
        this.subscription = terminalService.responseHandler.subscribe((response) => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.container = find(this.el.nativeElement, '.p-terminal')[0];
    }

    ngAfterViewChecked() {
        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }

    @Input()
    set response(value: string) {
        if (value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }

    handleCommand(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.commands.push({ text: this.command });
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        super.ngOnDestroy();
    }
}

@NgModule({
    exports: [Terminal, SharedModule],
    imports: [Terminal, SharedModule]
})
export class TerminalModule {}
