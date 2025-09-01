import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../core/services/auth/auth.service';

@Directive({
  selector: '[appShowIfRoleDirective]'
})
export class ShowIfRoleDirective {
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>, private vcr: ViewContainerRef, private authService: AuthService) { }

  @Input() set appShowIfRoleDirective(role: string) {
    const userRole = this.authService.getUserRole();
    if (userRole === role && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (userRole !== role && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }

}
