import { Component, Input, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DIALOG_CONFIG_DEFAULT } from 'src/app/shared/constants/dialog.constant';
import { Password } from 'src/types/file';
import {
  DetailDialogComponent,
  DetailDialogData,
} from '../detail-dialog/detail-dialog.component';

@Component({
  selector: 'app-password-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class PasswordDetailComponent {
  @Input() index: number;
  @Input() password: Password;
  @Input() isShowLoginId: boolean = false;
  @Input() isShowPassword: boolean = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  onClickCopyLoginId(event: Event) {
    this.copy(event, this.password.loginId);
  }

  onClickCopyPassword(event: Event) {
    this.copy(event, this.password.password);
  }

  private copy(event: Event, text: string) {
    const tmpElement = document.createElement('textarea');
    tmpElement.style.height = '0px';
    tmpElement.value = text;
    document.body.appendChild(tmpElement);
    tmpElement.select();
    document.execCommand('copy');
    tmpElement.remove();

    // コピー時は詳細ダイアログが開かないように親要素へのイベント伝搬を止める
    event.stopImmediatePropagation();

    this.ngZone.run(() => {
      this.snackBar.open('copy to clipboard', null, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    });
  }

  onClickEdit() {
    this.ngZone.run(() => {
      this.dialog.open(
        DetailDialogComponent,
        Object.assign({}, DIALOG_CONFIG_DEFAULT, {
          data: {
            index: this.index,
            info: this.password,
          } as DetailDialogData,
        })
      );
    });
  }
}
