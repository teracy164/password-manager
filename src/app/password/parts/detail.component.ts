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
  @Input() isShowPassword: boolean = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  onClickCopy(event: Event) {
    const text = document.createElement('textarea');
    text.style.height = '0px';
    text.value = this.password.password;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    text.remove();

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
