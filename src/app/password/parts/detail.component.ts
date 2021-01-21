import { Component, Input, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DIALOG_CONFIG_DEFAULT } from 'src/app/shared/constants/dialog.constant';
import { Password } from 'src/types/file';
import {
  DetailDialogComponent,
  DetailDialogData,
} from '../detail-dialog/detail-dialog.component';
import { PasswordService } from '../password.service';

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
    private service: PasswordService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  onClickCopy() {
    const text = document.createElement('textarea');
    text.style.height = '0px';
    text.value = this.password.password;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    text.remove();

    this.ngZone.run(() => {
      this.snackBar.open('copy to clipboard', null, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    });
  }

  onClickEdit() {
    this.dialog.open(
      DetailDialogComponent,
      Object.assign({}, DIALOG_CONFIG_DEFAULT, {
        data: {
          index: this.index,
          info: this.password,
        } as DetailDialogData,
      })
    );
  }
  onClickDelete() {
    const target = this.password;
    if (
      !confirm(`${target.name}を削除して良いですか？¥n削除すると元に戻せません`)
    ) {
      return;
    }

    this.service.deletePassword(this.index);
  }

  private createPassword() {
    const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
    const upperAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const number = '0123456789';
    const symbol = '!#$%&=~/*-+';
  }
}
