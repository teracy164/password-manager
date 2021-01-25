import { Component, NgZone, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/shared/storage.service';
import { GeneratePasswordOptions, Settings } from 'src/types/settings';
import { PasswordService } from '../password.service';

@Component({
  selector: 'app-generate-password-dialog',
  templateUrl: './generate-password-dialog.component.html',
  styleUrls: ['./generate-password-dialog.component.scss'],
})
export class GeneratePasswordDialogComponent implements OnInit {
  candidates: string[];
  generateOptions: GeneratePasswordOptions;
  isShowOptions = false;
  isCheckedAllSymbols = false;

  get symbols() {
    if (this.generateOptions?.use?.symbols) {
      return Object.keys(this.generateOptions.use.symbols);
    }
    return [];
  }

  constructor(
    public dialogRef: MatDialogRef<GeneratePasswordDialogComponent>,
    private service: PasswordService,
    private storage: StorageService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.generateOptions = this.storage.getGeneratePasswordOptions();
    this.isCheckedAllSymbols = Object.keys(
      this.generateOptions.use.symbols
    ).every((key) => this.generateOptions.use.symbols[key]);
    this.refleshCandidate();
  }

  private refleshCandidate() {
    this.candidates = [];
    for (let i = 0; i < 5; i++) {
      this.candidates.push(this.service.generatePassword(this.generateOptions));
    }
  }

  onChangePasswordLength(event: Event) {
    this.ngZone.run(() => {
      this.generateOptions.length = Number(
        (event.target as HTMLInputElement).value
      );
      this.storage.setGeneratePasswordOptions(this.generateOptions);
    });
  }

  onChangeGenerateOption(key: string, event: MatCheckboxChange) {
    this.ngZone.run(() => {
      this.generateOptions.use[key] = event.checked;
      this.storage.setGeneratePasswordOptions(this.generateOptions);
    });
  }

  onChangeGenerateOptionForSymbol(key: string, event: MatCheckboxChange) {
    this.ngZone.run(() => {
      this.generateOptions.use.symbols[key] = event.checked;
      this.storage.setGeneratePasswordOptions(this.generateOptions);
    });
  }

  onChangeAllSymbols(event: MatCheckboxChange) {
    this.ngZone.run(() => {
      this.isCheckedAllSymbols = event.checked;
      Object.keys(this.generateOptions.use.symbols).forEach((key) => {
        this.generateOptions.use.symbols[key] = event.checked;
      });
      this.storage.setGeneratePasswordOptions(this.generateOptions);
    });
  }

  onClickRegenerate() {
    this.refleshCandidate();
  }

  onSelected(index: number) {
    const password = this.candidates[index];
    this.ngZone.run(() => {
      this.dialogRef.close(password);
    });
  }

  onClickClose() {
    this.dialogRef.close(null);
  }
}
