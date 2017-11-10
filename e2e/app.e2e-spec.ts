import { MybcPage } from './app.po';

describe('mybc App', () => {
  let page: MybcPage;

  beforeEach(() => {
    page = new MybcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
