// error-dialog.component.ts
import { Component, effect, inject, ViewChild } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { ErrorDialogService } from './error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
  ],
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  @ViewChild('dialogRef') dialogRef!: HlmDialogComponent;
  errorMessage = '';
  private errorDialogService = inject(ErrorDialogService);

  constructor() {
    effect(() => {
      this.errorDialogService.error$.subscribe(message => {
        this.errorMessage = message;
        this.dialogRef.open();
      });
    });
  }

  closeDialog() {
    this.dialogRef.close(null); // Pass null as the result
  }
}
