import { Selector } from 'testcafe';

fixture `Gene search`
  .page `https://wwwdev.ebi.ac.uk/gxa/sc/home`;


test('Search for gene symbol', async t => {
  const searchTab = Selector('#local-nav-search');
  const geneInput = Selector('#gene-input');
  const searchButton = Selector('.small-12.columns button')

  await t
    .click(searchTab)
    .typeText(geneInput, 'PTEN')
    .pressKey('down enter')
    .click(searchButton);
});
