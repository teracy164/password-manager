import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Password } from 'src/types/file';
import { PasswordService } from '../password.service';

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

  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailDialogData,
    private service: PasswordService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      url: new FormControl(null, []),
      loginId: new FormControl(null, []),
      password: new FormControl(null, [Validators.required]),
    });

    console.log(this.data);
    if (this.data?.info) {
      Object.keys(this.data.info).forEach((key) =>
        this.form.get(key)?.reset(this.data.info[key])
      );
    }
  }

  async onClickSave() {
    if (this.form.invalid) {
      alert('input error');
      return;
    }

    const data = this.form.value as Password;
    const result = await this.update(data);
    if (result) {
      this.dialogRef.close();
    } else {
      alert('failure.');
    }
  }

  async update(password: Password) {
    return this.data
      ? this.service.updatePassword(this.data.index, password)
      : this.service.addPassword(password);
  }
}
