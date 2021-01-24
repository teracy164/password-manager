import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnInit,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
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
  dispFileNameLength = 0;
  settings: Settings;

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
    this.setFileNameLength();
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
        this.cdRef.detectChanges();
      });
    } else {
      alert('ファイルの読み込みに失敗しました');
    }
  }

  ngAfterViewInit() {
    this.setFileNameLength();
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
