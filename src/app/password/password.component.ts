import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_CONFIG_DEFAULT } from '../shared/constants/dialog.constant';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
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
  search = {
    keyword: '',
  };

  constructor(
    private service: PasswordService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  get meta() {
    return this.service.selected;
  }

  get passwords() {
    return this.service.passwords.filter((password) => {
      if (this.search.keyword) {
        if (password.name.includes(this.search.keyword)) {
          return true;
        }
        if (password.description?.includes(this.search.keyword)) {
          return true;
        }
        if (password.tags?.some((tag) => tag.includes(this.search.keyword))) {
          return true;
        }
        return false;
      }
      return true;
    });
  }

  get selectedFileName() {
    return this.meta.name.length > 8
      ? this.meta.name.slice(0, 8) + '...'
      : this.meta.name;
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
    this.ngZone.run(() => {
      this.isShowPassword = checked;
    });
  }

  onChangeKeyword(event) {
    this.search.keyword = event.target.value;
    this.cdRef.detectChanges();
  }

  async onClickSelectFile() {
    this.dialog
      .open(SelectFileDialogComponent, DIALOG_CONFIG_DEFAULT)
      .afterClosed()
      .subscribe((result) => {
        this.service.init();
      });
  }

  async onClickAddPassword() {
    this.dialog
      .open(DetailDialogComponent, DIALOG_CONFIG_DEFAULT)
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
}
