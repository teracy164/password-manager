import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Settings } from 'src/types/settings';
import { Loading } from '../shared/components/loading/loading.service';
import { DIALOG_CONFIG_DEFAULT } from '../shared/constants/dialog.constant';
import { StorageService } from '../shared/storage.service';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
import { PasswordService } from './password.service';
import { SelectFileDialogComponent } from './select-file-dialog/select-file-dialog.component';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit, AfterViewInit {
  isInitializing = true;
  dispFileNameLength = 0;
  settings: Settings;

  @ViewChild('elTagArea') elTagArea: ElementRef;
  @ViewChild('elPasswordArea') elPasswordArea: ElementRef;

  constructor(
    private service: PasswordService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private storage: StorageService,
    private loading: Loading
  ) {}

  get isLoading() {
    return this.loading.isLoading;
  }

  get meta() {
    return this.service.selected;
  }

  get passwords() {
    return this.service.passwords;
  }

  get passwordsEachTag() {
    return this.service.passwordsEachTag;
  }

  get selectedFileName() {
    if (this.dispFileNameLength === 0) {
      return '';
    }

    return this.meta.name.length > this.dispFileNameLength
      ? this.meta.name.slice(0, this.dispFileNameLength) + '...'
      : this.meta.name;
  }

  get tagsWithNoTagKey() {
    if (this.passwordsEachTag[this.noTagKey].length) {
      return [...this.tags, this.noTagKey];
    }
    return this.tags;
  }

  get tags() {
    return this.service.tags;
  }

  get noTagKey() {
    return this.service.noTagKey;
  }

  @HostListener('window:resize')
  onResize() {
    this.setScrollableAreaStyle();
    this.setFileNameLength();
  }

  private setScrollableAreaStyle(cnt = 0) {
    if (cnt++ > 20) return;

    if (this.elPasswordArea && this.elTagArea) {
      [
        this.elPasswordArea.nativeElement as HTMLDivElement,
        this.elTagArea.nativeElement as HTMLDivElement,
      ].forEach((el) => {
        el.style.height =
          window.innerHeight - el.getBoundingClientRect().top + 'px';
      });
    } else {
      setTimeout(() => this.setScrollableAreaStyle(cnt), 100);
    }
  }

  private setFileNameLength() {
    let len = 0;
    const width = window.innerWidth;
    if (width < 400) {
      len = 0;
    } else {
      len = Math.floor(width / 150) * 5;
    }
    if (this.dispFileNameLength !== len) {
      this.ngZone.run(() => {
        this.dispFileNameLength = len;
      });
    }
  }

  async ngOnInit() {
    this.loading.start();
    if (await this.service.init()) {
      this.ngZone.run(() => {
        this.settings = this.storage.getSettings();
        this.loading.end();
      });
    } else {
      alert('ファイルの読み込みに失敗しました');
      this.loading.end();
    }
    this.isInitializing = false;
  }

  ngAfterViewInit() {
    this.setScrollableAreaStyle();
    this.setFileNameLength();
  }

  onClickTag(tag: string) {
    const element = document.getElementById(tag);
    if (element) {
      const parent = this.elPasswordArea.nativeElement as HTMLDivElement;
      // パスワード表示領域の表示位置をオフセットとして保持
      const offset = parent.getBoundingClientRect().top;
      // ターゲットの表示位置（スクロールされた状態での実際の表示位置）
      const now = element.getBoundingClientRect().top;
      // パスワード表示領域の現在のスクロール位置からの相対的な位置情報でスクロール位置を算出
      parent.scrollTop = parent.scrollTop + (now - offset);
    }
  }

  onClickSelectFile() {
    const isFirstSelect = this.service.selected ? false : true;
    this.dialog
      .open(SelectFileDialogComponent, DIALOG_CONFIG_DEFAULT)
      .afterClosed()
      .subscribe(async (selectedFile) => {
        if (selectedFile) {
          await this.service.init();

          if (isFirstSelect) {
            // 初めてファイル選択をする場合はテンプレートが変わるため、高さ調整を行う
            this.setScrollableAreaStyle();
          }
        }
      });
  }

  onClickAddPassword() {
    this.dialog
      .open(DetailDialogComponent, DIALOG_CONFIG_DEFAULT)
      .afterClosed()
      .subscribe((result) => {
        this.cdRef.detectChanges();
      });
  }

  onClickRemoveSelectInfo() {
    this.service.removeFileInfo();
    this.cdRef.detectChanges();
  }
}
