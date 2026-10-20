describe('Defect management', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173', {
            onBeforeLoad(win) {
                win.localStorage.clear()
            },
        })
    })

    it('links a defect to a test and updates the dashboard when closed', () => {
        cy.contains('button', /^Defects$/).click()

        cy.get('#defect-test').select('TC-002')
        cy.get('#defect-title').type('Suspended license allows approval')
        cy.get('#defect-steps').type(
            '1. Open a provider.\n2. Set the license to Suspended.\n3. Attempt approval.',
        )
        cy.get('#defect-expected').type(
            'Approval is blocked and manual review is required.',
        )
        cy.get('#defect-actual').type('Provider can still be approved.')
        cy.get('#defect-severity').select('High')

        cy.contains('button', 'Report Defect').click()

        cy.contains('.defect-card', 'Suspended license allows approval')
            .within(() => {
                cy.contains('Related test:').parent().should('contain', 'TC-002')
                cy.contains('Severity:').parent().should('contain', 'High')
                cy.get('select').should('have.value', 'Open')
            })

        cy.contains('button', /^Dashboard$/).click()

        cy.contains('.stat-card', 'Open Defects')
            .find('h2')
            .should('have.text', '1')

        cy.contains('button', /^Defects$/).click()

        cy.contains('.defect-card', 'Suspended license allows approval')
            .find('select')
            .select('Closed')

        cy.reload()
        cy.contains('button', /^Defects$/).click()

        cy.contains('.defect-card', 'Suspended license allows approval')
            .within(() => {
                cy.get('select').should('have.value', 'Closed')
                cy.contains('Related test:').parent().should('contain', 'TC-002')
            })

        cy.contains('button', /^Dashboard$/).click()

        cy.contains('.stat-card', 'Open Defects')
            .find('h2')
            .should('have.text', '0')
    })
})