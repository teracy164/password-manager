import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DIALOG_CONFIG_DEFAULT } from 'src/app/shared/constants/dialog.constant';
import { Password } from 'src/types/file';
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';

@Component({
  selector: 'app-password-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class PasswordDetailComponent implements AfterViewInit {
  @Input() index: number;
  @Input() password: Password;
  @Input() isShowLoginId: boolean = false;
  @Input() isShowPassword: boolean = false;

  @ViewChild('elPasswordCard') elPasswordCard: ElementRef;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    // 幅の調整
    this.setWidth();
  }

  private setWidth() {
    // const padding = 10;
    // const width = 400;
    // const screenWidth = document.body.clientWidth - 40;
    // const num = Math.floor(screenWidth / width);
    // const el = this.elPasswordCard.nativeElement as HTMLDivElement;
    // const exWidth = screenWidth - width * num;
    // el.style.width = width + Math.floor(exWidth / num) - padding + 'px';
  }

  @HostListener('window:resize')
  onResize() {
    this.setWidth();
  }

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
          data: this.password,
        })
      );
    });
  }
}
