describe('Beer Catalog Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application', () => {
    cy.contains('Beer Catalog').should('be.visible');
  });

  it('should display beer cards', () => {
    cy.get('.beer-card, [data-cy="beer-card"]').should('have.length.greaterThan', 0);
  });

  it('should filter beers by name', () => {
    cy.get('input[id="filterName"]').type('IPA');
    cy.get('.beer-card, [data-cy="beer-card"]').each(($card) => {
      cy.wrap($card).should('contain.text', 'IPA');
    });
  });

  it('should filter by alcohol content', () => {
    cy.get('input[id="filterAlcohol"]').invoke('val', '5').trigger('input');
    cy.get('.beer-card, [data-cy="beer-card"]').should('have.length.greaterThan', 0);
  });

  it('should toggle favorites', () => {
    cy.get('.beer-card, [data-cy="beer-card"]').first().find('button').first().click();
    cy.get('.beer-card, [data-cy="beer-card"]').first().find('img[alt="Favorite"]').should('have.attr', 'src').and('include', 'star-selected');
  });

  it('should sort beers', () => {
    cy.get('select[id="sortOrder"]').select('name_desc');
    cy.get('.beer-card, [data-cy="beer-card"]').should('have.length.greaterThan', 0);
  });

  it('should open beer details modal', () => {
    cy.get('.beer-card, [data-cy="beer-card"]').first().contains('DETAILS').click();
    cy.get('.modal, [data-cy="beer-modal"]').should('be.visible');
  });

  it('should load more beers', () => {
    cy.get('.beer-card, [data-cy="beer-card"]').its('length').then((initialCount) => {
      cy.contains('Load More', { matchCase: false }).click();
      cy.get('.beer-card, [data-cy="beer-card"]').should('have.length.greaterThan', initialCount);
    });
  });

  it('should handle favorites filter', () => {
    cy.get('input[id="filterFavorites"]').check();
    cy.get('.beer-card, [data-cy="beer-card"]').should('have.length.greaterThan', 0);
  });
});