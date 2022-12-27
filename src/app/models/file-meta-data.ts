export class FileMetaData {
  public id: string = '';

  public name: string = '';

  public file: File;

  public url: string = '';

  constructor(file: File) {
    this.file = file;
  }
}
