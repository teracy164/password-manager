import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Password } from 'src/types/file';
import { PasswordService } from '../password.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface DetailDialogData {
  index: number;
  info: Password;
}

@Component({
  selector: 'app-password-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss'],
})
export class DetailDialogComponent implements OnInit {
  form: FormGroup;
  isProc = false;
  selectedTags: string[] = [];
  ctrlTag = new FormControl(null, []);
  @ViewChild('inputTag') inputTag: ElementRef;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  get allTags() {
    return this.service.tags;
  }

  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailDialogData,
    private service: PasswordService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      url: new FormControl(null, []),
      loginId: new FormControl(null, []),
      password: new FormControl(null, [Validators.required]),
    });

    if (this.data?.info) {
      Object.keys(this.data.info).forEach((key) => {
        if (key === 'tags') {
          this.selectedTags = [...this.data.info[key]];
        } else {
          this.form.get(key)?.reset(this.data.info[key]);
        }
      });
    }
  }

  onClickSave() {
    if (this.form.invalid) {
      alert('input error');
      return;
    }

    this.isProc = true;

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
      this.isProc = false;
    });
  }

  async update(password: Password) {
    return this.data
      ? this.service.updatePassword(this.data.index, password)
      : this.service.addPassword(password);
  }

  onClickClose() {
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
    if (!tag.trim()) {
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
