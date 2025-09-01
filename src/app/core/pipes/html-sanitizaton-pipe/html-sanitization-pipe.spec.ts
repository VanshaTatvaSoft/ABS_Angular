import { HtmlSanitizationPipe } from './html-sanitization-pipe';

describe('HtmlSanitizationPipe', () => {
  it('create an instance', () => {
    const pipe = new HtmlSanitizationPipe();
    expect(pipe).toBeTruthy();
  });
});
