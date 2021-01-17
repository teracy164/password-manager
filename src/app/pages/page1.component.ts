import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
})
export class Page1Component implements OnInit {
  constructor(private driveApi: GoogleDriveApiService) {}

  async ngOnInit() {
    const list = await this.driveApi.getFiles();
    console.log(list);
  }
}
