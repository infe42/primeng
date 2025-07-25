import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, booleanAttribute, computed, Directive, ElementRef, inject, input, Input, NgModule, NgZone, numberAttribute, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { appendChild, fadeIn, findSingle, getOuterHeight, getOuterWidth, getViewport, getWindowScrollLeft, getWindowScrollTop, hasClass, removeChild, uuid } from '@primeuix/utils';
import { TooltipOptions } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { Nullable } from 'primeng/ts-helpers';
import { ZIndexUtils } from 'primeng/utils';
import { TooltipStyle } from './style/tooltipstyle';

/**
 * Tooltip directive provides advisory information for a component.
 * @group Components
 */
@Directive({
    selector: '[pTooltip]',
    standalone: true,
    providers: [TooltipStyle]
})
export class Tooltip extends BaseComponent implements AfterViewInit, OnDestroy {
    /**
     * Position of the tooltip.
     * @group Props
     */
    @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' | string | undefined;
    /**
     * Event to show the tooltip.
     * @group Props
     */
    @Input() tooltipEvent: 'hover' | 'focus' | 'both' | string | any = 'hover';
    /**
     * Type of CSS position.
     * @group Props
     */
    @Input() positionStyle: string | undefined;
    /**
     * Style class of the tooltip.
     * @group Props
     */
    @Input() tooltipStyleClass: string | undefined;
    /**
     * Whether the z-index should be managed automatically to always go on top or have a fixed value.
     * @group Props
     */
    @Input() tooltipZIndex: string | undefined;
    /**
     * By default the tooltip contents are rendered as text. Set to false to support html tags in the content.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) escape: boolean = true;
    /**
     * Delay to show the tooltip in milliseconds.
     * @group Props
     */
    @Input({ transform: numberAttribute }) showDelay: number | undefined;
    /**
     * Delay to hide the tooltip in milliseconds.
     * @group Props
     */
    @Input({ transform: numberAttribute }) hideDelay: number | undefined;
    /**
     * Time to wait in milliseconds to hide the tooltip even it is active.
     * @group Props
     */
    @Input({ transform: numberAttribute }) life: number | undefined;
    /**
     * Specifies the additional vertical offset of the tooltip from its default position.
     * @group Props
     */
    @Input({ transform: numberAttribute }) positionTop: number | undefined;
    /**
     * Specifies the additional horizontal offset of the tooltip from its default position.
     * @group Props
     */
    @Input({ transform: numberAttribute }) positionLeft: number | undefined;
    /**
     * Whether to hide tooltip when hovering over tooltip content.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autoHide: boolean = true;
    /**
     * Automatically adjusts the element position when there is not enough space on the selected position.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) fitContent: boolean = true;
    /**
     * Whether to hide tooltip on escape key press.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) hideOnEscape: boolean = true;
    /**
     * Content of the tooltip.
     * @group Props
     */
    @Input('pTooltip') content: string | TemplateRef<HTMLElement> | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @defaultValue false
     * @group Props
     */
    @Input('tooltipDisabled') get disabled(): boolean {
        return this._disabled as boolean;
    }
    set disabled(val: boolean) {
        this._disabled = val;
        this.deactivate();
    }
    /**
     * Specifies the tooltip configuration options for the component.
     * @group Props
     */
    @Input() tooltipOptions: TooltipOptions | undefined;
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    _tooltipOptions = {
        tooltipLabel: null,
        tooltipPosition: 'right',
        tooltipEvent: 'hover',
        appendTo: 'body',
        positionStyle: null,
        tooltipStyleClass: null,
        tooltipZIndex: 'auto',
        escape: true,
        disabled: null,
        showDelay: null,
        hideDelay: null,
        positionTop: null,
        positionLeft: null,
        life: null,
        autoHide: true,
        hideOnEscape: true,
        id: uuid('pn_id_') + '_tooltip'
    };

    _disabled: boolean | undefined;

    container: any;

    styleClass: string | undefined;

    tooltipText: any;

    showTimeout: any;

    hideTimeout: any;

    active: boolean | undefined;

    mouseEnterListener: Nullable<Function>;

    mouseLeaveListener: Nullable<Function>;

    containerMouseleaveListener: Nullable<Function>;

    clickListener: Nullable<Function>;

    focusListener: Nullable<Function>;

    blurListener: Nullable<Function>;

    documentEscapeListener: Nullable<Function>;

    scrollHandler: any;

    resizeListener: any;

    _componentStyle = inject(TooltipStyle);

    interactionInProgress = false;

    constructor(
        public zone: NgZone,
        private viewContainer: ViewContainerRef
    ) {
        super();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                const tooltipEvent = this.getOption('tooltipEvent');

                if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
                    this.mouseEnterListener = this.onMouseEnter.bind(this);
                    this.mouseLeaveListener = this.onMouseLeave.bind(this);
                    this.clickListener = this.onInputClick.bind(this);
                    this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener);
                    this.el.nativeElement.addEventListener('click', this.clickListener);
                    this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener);
                }
                if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
                    this.focusListener = this.onFocus.bind(this);
                    this.blurListener = this.onBlur.bind(this);

                    let target = this.el.nativeElement.querySelector('.p-component');

                    if (!target) {
                        target = this.getTarget(this.el.nativeElement);
                    }

                    target.addEventListener('focus', this.focusListener);
                    target.addEventListener('blur', this.blurListener);
                }
            });
        }
    }

    ngOnChanges(simpleChange: SimpleChanges) {
        super.ngOnChanges(simpleChange);
        if (simpleChange.tooltipPosition) {
            this.setOption({ tooltipPosition: simpleChange.tooltipPosition.currentValue });
        }

        if (simpleChange.tooltipEvent) {
            this.setOption({ tooltipEvent: simpleChange.tooltipEvent.currentValue });
        }

        if (simpleChange.appendTo) {
            this.setOption({ appendTo: simpleChange.appendTo.currentValue });
        }

        if (simpleChange.positionStyle) {
            this.setOption({ positionStyle: simpleChange.positionStyle.currentValue });
        }

        if (simpleChange.tooltipStyleClass) {
            this.setOption({ tooltipStyleClass: simpleChange.tooltipStyleClass.currentValue });
        }

        if (simpleChange.tooltipZIndex) {
            this.setOption({ tooltipZIndex: simpleChange.tooltipZIndex.currentValue });
        }

        if (simpleChange.escape) {
            this.setOption({ escape: simpleChange.escape.currentValue });
        }

        if (simpleChange.showDelay) {
            this.setOption({ showDelay: simpleChange.showDelay.currentValue });
        }

        if (simpleChange.hideDelay) {
            this.setOption({ hideDelay: simpleChange.hideDelay.currentValue });
        }

        if (simpleChange.life) {
            this.setOption({ life: simpleChange.life.currentValue });
        }

        if (simpleChange.positionTop) {
            this.setOption({ positionTop: simpleChange.positionTop.currentValue });
        }

        if (simpleChange.positionLeft) {
            this.setOption({ positionLeft: simpleChange.positionLeft.currentValue });
        }

        if (simpleChange.disabled) {
            this.setOption({ disabled: simpleChange.disabled.currentValue });
        }

        if (simpleChange.content) {
            this.setOption({ tooltipLabel: simpleChange.content.currentValue });

            if (this.active) {
                if (simpleChange.content.currentValue) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    } else {
                        this.show();
                    }
                } else {
                    this.hide();
                }
            }
        }

        if (simpleChange.autoHide) {
            this.setOption({ autoHide: simpleChange.autoHide.currentValue });
        }

        if (simpleChange.id) {
            this.setOption({ id: simpleChange.id.currentValue });
        }

        if (simpleChange.tooltipOptions) {
            this._tooltipOptions = { ...this._tooltipOptions, ...simpleChange.tooltipOptions.currentValue };
            this.deactivate();

            if (this.active) {
                if (this.getOption('tooltipLabel')) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    } else {
                        this.show();
                    }
                } else {
                    this.hide();
                }
            }
        }
    }

    isAutoHide(): boolean {
        return this.getOption('autoHide');
    }

    onMouseEnter(e: Event) {
        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }

    onMouseLeave(e: MouseEvent) {
        if (!this.isAutoHide()) {
            const valid = hasClass(e.relatedTarget as any, 'p-tooltip') || hasClass(e.relatedTarget as any, 'p-tooltip-text') || hasClass(e.relatedTarget as any, 'p-tooltip-arrow');
            !valid && this.deactivate();
        } else {
            this.deactivate();
        }
    }

    onFocus(e: Event) {
        this.activate();
    }

    onBlur(e: Event) {
        this.deactivate();
    }

    onInputClick(e: Event) {
        this.deactivate();
    }

    activate() {
        if (!this.interactionInProgress) {
            this.active = true;
            this.clearHideTimeout();

            if (this.getOption('showDelay'))
                this.showTimeout = setTimeout(() => {
                    this.show();
                }, this.getOption('showDelay'));
            else this.show();

            if (this.getOption('life')) {
                let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
                this.hideTimeout = setTimeout(() => {
                    this.hide();
                }, duration);
            }

            if (this.getOption('hideOnEscape')) {
                this.documentEscapeListener = this.renderer.listen('document', 'keydown.escape', () => {
                    this.deactivate();
                    this.documentEscapeListener();
                });
            }
            this.interactionInProgress = true;
        }
    }

    deactivate() {
        this.interactionInProgress = false;
        this.active = false;
        this.clearShowTimeout();

        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.getOption('hideDelay'));
        } else {
            this.hide();
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
    }

    create() {
        if (this.container) {
            this.clearHideTimeout();
            this.remove();
        }

        this.container = document.createElement('div');
        this.container.setAttribute('id', this.getOption('id'));
        this.container.setAttribute('role', 'tooltip');

        let tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'p-tooltip-arrow';
        tooltipArrow.setAttribute('data-pc-section', 'arrow');
        this.container.appendChild(tooltipArrow);

        this.tooltipText = document.createElement('div');
        this.tooltipText.className = 'p-tooltip-text';

        this.updateText();

        if (this.getOption('positionStyle')) {
            this.container.style.position = this.getOption('positionStyle');
        }

        this.container.appendChild(this.tooltipText);

        if (this.getOption('appendTo') === 'body') document.body.appendChild(this.container);
        else if (this.getOption('appendTo') === 'target') appendChild(this.container, this.el.nativeElement);
        else appendChild(this.getOption('appendTo'), this.container);

        this.container.style.display = 'none';

        if (this.fitContent) {
            this.container.style.width = 'fit-content';
        }

        if (this.isAutoHide()) {
            this.container.style.pointerEvents = 'none';
        } else {
            this.container.style.pointerEvents = 'unset';
            this.bindContainerMouseleaveListener();
        }
    }

    bindContainerMouseleaveListener() {
        if (!this.containerMouseleaveListener) {
            const targetEl: any = this.container ?? this.container.nativeElement;

            this.containerMouseleaveListener = this.renderer.listen(targetEl, 'mouseleave', (e) => {
                this.deactivate();
            });
        }
    }

    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener = null;
        }
    }

    show() {
        if (!this.getOption('tooltipLabel') || this.getOption('disabled')) {
            return;
        }

        this.create();

        const nativeElement = this.el.nativeElement;
        const pDialogWrapper = nativeElement.closest('p-dialog');

        if (pDialogWrapper) {
            setTimeout(() => {
                this.container && (this.container.style.display = 'inline-block');
                this.container && this.align();
            }, 100);
        } else {
            this.container.style.display = 'inline-block';
            this.align();
        }

        fadeIn(this.container, 250);

        if (this.getOption('tooltipZIndex') === 'auto') ZIndexUtils.set('tooltip', this.container, this.config.zIndex.tooltip);
        else this.container.style.zIndex = this.getOption('tooltipZIndex');

        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }

    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container);
        }

        this.remove();
    }

    updateText() {
        const content = this.getOption('tooltipLabel');
        if (content instanceof TemplateRef) {
            const embeddedViewRef = this.viewContainer.createEmbeddedView(content);
            embeddedViewRef.detectChanges();
            embeddedViewRef.rootNodes.forEach((node) => this.tooltipText.appendChild(node));
        } else if (this.getOption('escape')) {
            this.tooltipText.innerHTML = '';
            this.tooltipText.appendChild(document.createTextNode(content));
        } else {
            this.tooltipText.innerHTML = content;
        }
    }

    align() {
        let position = this.getOption('tooltipPosition');

        const positionPriority = {
            top: [this.alignTop, this.alignBottom, this.alignRight, this.alignLeft],
            bottom: [this.alignBottom, this.alignTop, this.alignRight, this.alignLeft],
            left: [this.alignLeft, this.alignRight, this.alignTop, this.alignBottom],
            right: [this.alignRight, this.alignLeft, this.alignTop, this.alignBottom]
        };

        for (let [index, alignmentFn] of positionPriority[position].entries()) {
            if (index === 0) alignmentFn.call(this);
            else if (this.isOutOfBounds()) alignmentFn.call(this);
            else break;
        }
    }

    getHostOffset() {
        if (this.getOption('appendTo') === 'body' || this.getOption('appendTo') === 'target') {
            let offset = this.el.nativeElement.getBoundingClientRect();
            let targetLeft = offset.left + getWindowScrollLeft();
            let targetTop = offset.top + getWindowScrollTop();

            return { left: targetLeft, top: targetTop };
        } else {
            return { left: 0, top: 0 };
        }
    }

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.startsWith('P-') ? (findSingle(this.el.nativeElement, '.p-component') as HTMLElement) : this.el.nativeElement;
    }

    alignRight() {
        this.preAlign('right');
        const el = this.activeElement;
        const offsetLeft = getOuterWidth(el);
        const offsetTop = (getOuterHeight(el) - getOuterHeight(this.container)) / 2;
        this.alignTooltip(offsetLeft, offsetTop);
        let arrowElement = this.getArrowElement();

        arrowElement.style.top = '50%';
        arrowElement.style.right = null;
        arrowElement.style.bottom = null;
        arrowElement.style.left = '0';
    }

    alignLeft() {
        this.preAlign('left');
        let arrowElement = this.getArrowElement();
        let offsetLeft = getOuterWidth(this.container);
        let offsetTop = (getOuterHeight(this.el.nativeElement) - getOuterHeight(this.container)) / 2;
        this.alignTooltip(-offsetLeft, offsetTop);

        arrowElement.style.top = '50%';
        arrowElement.style.right = '0';
        arrowElement.style.bottom = null;
        arrowElement.style.left = null;
    }

    alignTop() {
        this.preAlign('top');
        let arrowElement = this.getArrowElement();
        let hostOffset = this.getHostOffset();
        let elementWidth = getOuterWidth(this.container);

        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container)) / 2;
        let offsetTop = getOuterHeight(this.container);
        this.alignTooltip(offsetLeft, -offsetTop);

        let elementRelativeCenter = hostOffset.left - this.getHostOffset().left + elementWidth / 2;
        arrowElement.style.top = null;
        arrowElement.style.right = null;
        arrowElement.style.bottom = '0';
        arrowElement.style.left = elementRelativeCenter + 'px';
    }

    getArrowElement(): any {
        return findSingle(this.container, '[data-pc-section="arrow"]');
    }

    alignBottom() {
        this.preAlign('bottom');
        let arrowElement = this.getArrowElement();
        let elementWidth = getOuterWidth(this.container);
        let hostOffset = this.getHostOffset();
        let offsetLeft = (getOuterWidth(this.el.nativeElement) - getOuterWidth(this.container)) / 2;
        let offsetTop = getOuterHeight(this.el.nativeElement);
        this.alignTooltip(offsetLeft, offsetTop);

        let elementRelativeCenter = hostOffset.left - this.getHostOffset().left + elementWidth / 2;

        arrowElement.style.top = '0';
        arrowElement.style.right = null;
        arrowElement.style.bottom = null;
        arrowElement.style.left = elementRelativeCenter + 'px';
    }

    alignTooltip(offsetLeft, offsetTop) {
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + offsetLeft;
        let top = hostOffset.top + offsetTop;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }

    setOption(option: any) {
        this._tooltipOptions = { ...this._tooltipOptions, ...option };
    }

    getOption(option: string) {
        return this._tooltipOptions[option as keyof typeof this.tooltipOptions];
    }

    getTarget(el: Element) {
        return hasClass(el, 'p-inputwrapper') ? findSingle(el, 'input') : el;
    }

    preAlign(position: string) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';

        let defaultClassName = 'p-tooltip p-component p-tooltip-' + position;
        this.container.className = this.getOption('tooltipStyleClass') ? defaultClassName + ' ' + this.getOption('tooltipStyleClass') : defaultClassName;
    }

    isOutOfBounds(): boolean {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = getOuterWidth(this.container);
        let height = getOuterHeight(this.container);
        let viewport = getViewport();

        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }

    onWindowResize(e: Event) {
        this.hide();
    }

    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.resizeListener);
        });
    }

    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (this.container) {
                    this.hide();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    unbindEvents() {
        const tooltipEvent = this.getOption('tooltipEvent');

        if (tooltipEvent === 'hover' || tooltipEvent === 'both') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener);
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
            this.el.nativeElement.removeEventListener('click', this.clickListener);
        }
        if (tooltipEvent === 'focus' || tooltipEvent === 'both') {
            let target = this.el.nativeElement.querySelector('.p-component');

            if (!target) {
                target = this.getTarget(this.el.nativeElement);
            }

            target.removeEventListener('focus', this.focusListener);
            target.removeEventListener('blur', this.blurListener);
        }
        this.unbindDocumentResizeListener();
    }

    remove() {
        if (this.container && this.container.parentElement) {
            if (this.getOption('appendTo') === 'body') document.body.removeChild(this.container);
            else if (this.getOption('appendTo') === 'target') this.el.nativeElement.removeChild(this.container);
            else removeChild(this.getOption('appendTo'), this.container);
        }

        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.clearTimeouts();
        this.container = null;
        this.scrollHandler = null;
    }

    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }

    ngOnDestroy() {
        this.unbindEvents();
        super.ngOnDestroy();

        if (this.container) {
            ZIndexUtils.clear(this.container);
        }

        this.remove();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
    }
}

@NgModule({
    imports: [Tooltip],
    exports: [Tooltip]
})
export class TooltipModule {}
