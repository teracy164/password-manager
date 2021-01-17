import { Injectable } from '@angular/core';
import { GoogleApiService } from './google-api.service';

@Injectable()
export class GoogleDriveApiService {
  constructor(private googleapi: GoogleApiService) {}

  get drive() {
    return this.googleapi.gapi.client.drive;
  }

  async getFiles() {
    this.drive.files
      .list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      })
      .then((response) => {
        console.log(response);
      });
  }
}
