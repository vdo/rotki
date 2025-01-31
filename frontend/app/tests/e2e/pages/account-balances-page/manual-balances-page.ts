import { capitalize } from '@/filters';
import { TradeLocation } from '@/services/history/types';
import { bigNumberify, Zero } from '@/utils/bignumbers';
import { AccountBalancesPage } from './index';

export interface FixtureManualBalance {
  readonly asset: string;
  readonly keyword: string;
  readonly label: string;
  readonly amount: string;
  readonly location: TradeLocation;
  readonly tags: string[];
}

export class ManualBalancesPage extends AccountBalancesPage {
  visit() {
    cy.get('.accounts-balances__manual-balances')
      .scrollIntoView()
      .should('be.visible')
      .click({
        force: true
      });
  }

  addBalance(balance: FixtureManualBalance) {
    cy.get('.big-dialog').should('be.visible');
    cy.get('.manual-balances-form__asset')
      .type(balance.keyword)
      .type('{enter}');
    cy.get('.manual-balances-form__label').type(balance.label);
    cy.get('.manual-balances-form__amount').type(balance.amount);
    for (const tag of balance.tags) {
      cy.get('.manual-balances-form__tags').type(tag).type('{enter}');
    }
    cy.get('.manual-balances-form__location').click();
    cy.get('.manual-balances-form__location div.v-select__selections input')
      .type(`{selectall}{backspace}`)
      .type(balance.location)
      .type('{enter}');
    cy.get('.big-dialog__buttons__confirm').click();
    cy.get('.big-dialog', { timeout: 45000 }).should('not.be.visible');
  }

  visibleEntries(visible: number) {
    // the total row is added to the visible entries
    cy.get('[data-cy="manual-balances"] tbody')
      .find('tr')
      .should('have.length', visible + 1);
  }

  balanceShouldMatch(balances: FixtureManualBalance[]) {
    let i = 0;
    for (const balance of balances) {
      cy.get('[data-cy="manual-balances"] tbody').find('tr').eq(i).as('row');

      cy.get('@row')
        .find('.manual-balances-list__amount')
        .should('contain', this.formatAmount(balance.amount));

      i += 1;
    }
  }

  balanceShouldNotMatch(balances: FixtureManualBalance[]) {
    let i = 0;
    for (const balance of balances) {
      cy.get('[data-cy="manual-balances"] tbody').find('tr').eq(i).as('row');

      cy.get('@row')
        .find('.manual-balances-list__amount')
        .should('not.contain', this.formatAmount(balance.amount));

      i += 1;
    }
  }

  isVisible(position: number, balance: FixtureManualBalance) {
    cy.get('[data-cy="manual-balances"] tbody')
      .find('tr')
      .eq(position)
      .as('row');

    cy.get('@row').find('[data-cy=label]').should('contain', balance.label);

    cy.get('@row')
      .find('.manual-balances-list__amount')
      .should('contain', this.formatAmount(balance.amount));

    cy.get('[data-cy="manual-balances"] thead').scrollIntoView();

    cy.get('@row')
      .find('.manual-balances-list__location')
      .should('contain', capitalize(balance.location));

    cy.get('@row')
      .find('[data-cy=details-symbol]')
      .should('contain.text', balance.asset);

    for (const tag of balance.tags) {
      cy.get('@row').find('.tag').contains(tag).should('be.visible');
    }
  }

  getLocationBalances() {
    const balanceLocations = [
      { location: 'Blockchain', renderedValue: Zero },
      { location: 'Banks', renderedValue: Zero },
      { location: 'External', renderedValue: Zero },
      { location: 'Commodities', renderedValue: Zero },
      { location: 'Real estate', renderedValue: Zero },
      { location: 'Equities', renderedValue: Zero }
    ];

    balanceLocations.forEach(balanceLocation => {
      cy.get('[data-cy="manual-balances"] tr').then($rows => {
        if ($rows.text().includes(balanceLocation.location)) {
          cy.get(
            `[data-cy="manual-balances"] tr:contains(${balanceLocation.location})`
          ).each($row => {
            // loops over all manual balances rows and adds up the total per location
            // TODO: extract the replace(',', '') as to use user settings (when implemented)
            cy.wrap($row)
              .find(
                ':nth-child(5) > .amount-display > .v-skeleton-loader .amount-display__value'
              )
              .then($amount => {
                if (balanceLocation.renderedValue === Zero) {
                  balanceLocation.renderedValue = bigNumberify(
                    this.getSanitizedAmountString($amount.text())
                  );
                } else {
                  balanceLocation.renderedValue =
                    balanceLocation.renderedValue.plus(
                      bigNumberify(
                        this.getSanitizedAmountString($amount.text())
                      )
                    );
                }
              });
          });
        }
      });
    });

    return cy.wrap(balanceLocations);
  }

  editBalance(position: number, amount: string) {
    cy.get('[data-cy="manual-balances"] tbody')
      .find('tr')
      .eq(position)
      .find('button.manual-balances-list__actions__edit')
      .click();

    cy.get('[data-cy="manual-balance-form"]').as('edit-form');
    cy.get('@edit-form').find('.manual-balances-form__amount input').clear();
    cy.get('@edit-form').find('.manual-balances-form__amount').type(amount);
    cy.get('.big-dialog__buttons__confirm').click();
  }

  deleteBalance(position: number) {
    cy.get('[data-cy="manual-balances"] tbody')
      .find('tr')
      .eq(position)
      .find('.manual-balances-list__actions__delete')
      .click();

    this.confirmDelete();
  }

  confirmDelete() {
    cy.get('[data-cy=confirm-dialog]')
      .find('[data-cy=dialog-title]')
      .should('contain', 'Delete manually tracked balance');
    cy.get('[data-cy=confirm-dialog]').find('[data-cy=button-confirm]').click();
  }

  showsCurrency(currency: string) {
    cy.get('[data-cy="manual-balances"]')
      .scrollIntoView()
      .contains(`${currency} Value`)
      .should('be.visible');
  }
}
