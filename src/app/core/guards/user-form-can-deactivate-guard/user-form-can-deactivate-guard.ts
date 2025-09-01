import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from './can-component-deactivate.interface';

export const userFormCanDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  debugger
  return component.canDeactivate ? component.canDeactivate() : true;
};
