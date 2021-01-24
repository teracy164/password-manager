/** パスワード生成オプション */
export interface GeneratePasswordOptions {
  /** パスワード長 */
  length: number;
  /** パスワード使用文字種別 */
  use: {
    /** 英字小文字 */
    lowerAlpha: true;
    /** 英字大文字 */
    upperAlpha: true;
    /** 数字 */
    number: true;
    /** 記号 */
    symbols: {
      '!': true;
      '#': true;
      $: true;
      '%': true;
      '&': true;
      '=': true;
      '~': true;
      '/': true;
      '*': true;
      '-': true;
      '+': true;
      '(': true;
      ')': true;
      '[': true;
      ']': true;
    };
  };
}

export interface Settings {
  /** 一覧 */
  list: {
    /** タグごとに表示 */
    isShowTag: boolean;
  };
  /** パスワード生成設定 */
  generatePassword: GeneratePasswordOptions;
}
