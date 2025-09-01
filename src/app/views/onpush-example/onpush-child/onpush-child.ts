import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-onpush-child',
  imports: [],
  templateUrl: './onpush-child.html',
  styleUrl: './onpush-child.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnpushChild {
  @Input() user!: {name: string}
}
