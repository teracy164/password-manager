import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DetailDialogComponent,
  DetailDialogData,
} from './detail-dialog/detail-dialog.component';
import { PasswordService } from './password.service';
import { SelectFileDialogComponent } from './select-file-dialog/select-file-dialog.component';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  isLoading = true;
  isShowPassword = false;

  constructor(
    private service: PasswordService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {}

  get meta() {
    return this.service.selected;
  }

  get passwords() {
    return this.service.passwords;
  }

  async ngOnInit() {
    if (await this.service.init()) {
      this.isLoading = false;

      this.cdRef.detectChanges();
    } else {
      alert('ファイルの読み込みに失敗しました');
    }
  }

  onChangeShowPassword(checked: boolean) {
    this.isShowPassword = checked;
  }

  async onClickSelectFile() {
    this.dialog
      .open(SelectFileDialogComponent, this.getDialogConfig())
      .afterClosed()
      .subscribe((result) => {
        this.service.init();
      });
  }

  async onClickAddPassword() {
    this.dialog
      .open(DetailDialogComponent, this.getDialogConfig())
      .afterClosed()
      .subscribe((result) => {
        console.log('add end');
        this.cdRef.detectChanges();
      });
  }

  onClickRemoveSelectInfo() {
    this.service.removeFileInfo();
    this.cdRef.detectChanges();
  }

  onClickCopy(index: number) {
    const text = document.createElement('textarea');
    text.style.height = '0px';
    text.value = this.passwords[index].password;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    text.remove();

    this.snackBar.open('copy to clipboard', null, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  onClickEdit(index: number) {
    this.dialog
      .open(
        DetailDialogComponent,
        this.getDialogConfig({
          data: {
            index,
            info: this.passwords[index],
          } as DetailDialogData,
        })
      )
      .afterClosed()
      .subscribe((result) => {
        this.cdRef.detectChanges();
      });
  }
  onClickDelete(index: number) {
    const target = this.passwords[index];
    if (
      !confirm(`${target.name}を削除して良いですか？¥n削除すると元に戻せません`)
    ) {
      return;
    }

    this.service.deletePassword(index);
  }

  private getDialogConfig(src?: MatDialogConfig) {
    return Object.assign(
      {
        width: '400px',
        maxWidth: '98%',
        maxHeight: '70vh',
        autoFocus: false,
        disableClose: false,
      } as MatDialogConfig,
      src
    );
  }
}
