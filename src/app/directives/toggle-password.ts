import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]'
})
export class TogglePassword {
  private shown = false;
  private icon!: HTMLElement;
  private renderer = inject(Renderer2);
  private el = inject(ElementRef<HTMLInputElement>);

  constructor() { }

  ngOnInit() {
    const parent = this.renderer.parentNode(this.el.nativeElement);
    this.renderer.setStyle(parent, 'position', 'relative');

    this.icon = this.renderer.createElement('mat-icon');
    this.renderer.addClass(this.icon, 'material-icons');
    this.renderer.setProperty(this.icon, 'innerText', 'visibility_off');
    this.renderer.setStyle(this.icon, 'cursor', 'pointer');
    this.renderer.setStyle(this.icon, 'position', 'absolute');
    this.renderer.setStyle(this.icon, 'top', '54%');
    this.renderer.setStyle(this.icon, 'right', '2px');
    this.renderer.setStyle(this.icon, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.icon, 'color', '#757575');

    this.renderer.appendChild(parent, this.icon);

    this.renderer.listen(this.icon, 'click', () => this.toggle());
  }

  toggle() {
    this.shown = !this.shown;
    this.el.nativeElement.type = this.shown ? 'text' : 'password';
    this.icon.innerText = this.shown ? 'visibility' : 'visibility_off';
  }

}
