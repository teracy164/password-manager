import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Password } from 'src/types/file';
import { PasswordService } from './password.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
})
export class PasswordComponent implements OnInit {
  isLoading = true;

  constructor(
    private service: PasswordService,
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
      console.log(this.meta);
      this.isLoading = false;

      this.cdRef.detectChanges();
    } else {
      alert('ファイルの読み込みに失敗しました');
    }
  }

  async onClickNewFile(elInput: HTMLInputElement) {
    await this.service.createFile(elInput.value);

    this.cdRef.detectChanges();
  }

  async onClickAddPassword(
    elInputName: HTMLInputElement,
    elInputPassword: HTMLInputElement
  ) {
    const info: Password = {
      name: elInputName.value,
      description: '',
      password: elInputPassword.value,
      url: '',
    };
    await this.service.updateFile(this.meta.id, info);

    this.cdRef.detectChanges();
  }

  onClickRemoveSelectInfo() {
    this.service.removeFileInfo();
    this.cdRef.detectChanges();
  }
}
