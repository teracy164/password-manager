export type FileMimeType =
  | 'application/vnd.google-apps.document'
  | 'application/vnd.google-apps.folder';

export interface FileMetaInfo {
  id: string;
  kind: string;
  name: string;
  mimeType: FileMimeType;
}

export interface Password {
  id: string;
  tags: string[];
  name: string;
  loginId: string;
  password: string;
  description: string;
  url: string;
}

export interface PasswordFile {
  $$version: string;
  $$createdBy: string;
  passwords: Password[];
}
