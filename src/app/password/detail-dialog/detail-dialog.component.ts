import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Password } from 'src/types/file';
import { PasswordService } from '../password.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Loading } from 'src/app/shared/components/loading/loading.service';
import { GeneratePasswordDialogComponent } from '../generate-password-dialog/generate-password-dialog.component';
import { DIALOG_CONFIG_DEFAULT } from 'src/app/shared/constants/dialog.constant';

@Component({
  selector: 'app-password-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss'],
})
export class DetailDialogComponent implements OnInit {
  form: FormGroup;
  selectedTags: string[] = [];
  ctrlTag = new FormControl(null, []);
  isShowPassword = false;
  @ViewChild('inputTag') inputTag: ElementRef;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  get allTags() {
    return this.service.tags;
  }

  get isEdit() {
    return this.src ? true : false;
  }

  get isLoading() {
    return this.loading.isLoading;
  }

  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public src: Password,
    private service: PasswordService,
    private ngZone: NgZone,
    private loading: Loading
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      url: new FormControl(null, []),
      loginId: new FormControl(null, []),
      password: new FormControl(null, [Validators.required]),
    });

    if (this.isEdit) {
      Object.keys(this.src).forEach((key) => {
        if (key === 'tags') {
          if (this.src[key]?.length) {
            this.selectedTags = [...this.src[key]];
          }
        } else {
          this.form.get(key)?.reset(this.src[key]);
        }
      });
    }
  }

  onChangeShowPassword() {
    this.ngZone.run(() => {
      this.isShowPassword = !this.isShowPassword;
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      alert('input error');
      return;
    }
    this.loading.start();

    this.ngZone.run(async () => {
      // 確定してないタグがある場合は追加する
      this.addTag(this.ctrlTag.value);

      const data = this.form.value as Password;
      data.tags = this.selectedTags;

      const result = await this.update(data);
      if (result) {
        this.dialogRef.close();
      } else {
        alert('failure.');
      }
      this.loading.end();
    });
  }

  async update(password: Password) {
    return this.isEdit
      ? this.service.updatePassword(this.src.id, password)
      : this.service.addPassword(password);
  }

  async onClickDelete() {
    const target = this.src;
    if (
      !confirm(`${target.name}を削除して良いですか？¥n削除すると元に戻せません`)
    ) {
      return;
    }
    this.loading.start();

    await this.service.deletePassword(this.src.id);

    this.loading.end();
    this.close();
  }

  onClickGeneratePassword() {
    this.dialog
      .open(GeneratePasswordDialogComponent, DIALOG_CONFIG_DEFAULT)
      .afterClosed()
      .subscribe((selectedPassword: string) => {
        if (selectedPassword) {
          this.ngZone.run(() => {
            this.form.get('password').setValue(selectedPassword);
          });
        }
      });
  }

  onClickClose() {
    this.close();
  }

  private close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

  onRemoveTag(tag: string) {
    const index = this.selectedTags.findIndex((t) => t === tag);
    if (index >= 0) {
      this.ngZone.run(() => {
        this.selectedTags.splice(index, 1);
      });
    }
  }

  onAddTag(event: MatChipInputEvent): void {
    this.addTag(event.value);
  }

  onSelectedTag(event: MatAutocompleteSelectedEvent): void {
    this.addTag(event.option.viewValue);
  }

  private addTag(tag: string) {
    if (!tag?.trim()) {
      return;
    }

    this.ngZone.run(() => {
      this.selectedTags = Array.from(
        new Set(this.selectedTags.concat(tag.trim()))
      );
      this.ctrlTag.reset(null);

      (this.inputTag.nativeElement as HTMLInputElement).value = '';
    });
  }
}
