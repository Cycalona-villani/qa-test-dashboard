describe('Test case management', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173', {
            onBeforeLoad(win) {
                win.localStorage.clear()
            },
        })
    })

    it('creates a test case and keeps it after refresh', () => {
        cy.contains('button', /^Test Cases$/).click()

        cy.get('#test-title').type('Block approval for expired licenses')
        cy.get('#test-steps').type(
            '1. Open a provider record.\n2. Set the license to Expired.\n3. Attempt approval.',
        )
        cy.get('#test-expected').type('Approval is blocked.')
        cy.get('#test-priority').select('High')

        cy.contains('button', 'Add Test Case').click()

        cy.contains('tr', 'Block approval for expired licenses').within(() => {
            cy.contains('td', 'High').should('be.visible')
            cy.contains('summary', 'View test instructions').click()
            cy.contains('Approval is blocked.').should('be.visible')
        })

        cy.reload()
        cy.contains('button', /^Test Cases$/).click()

        cy.contains('tr', 'Block approval for expired licenses').within(() => {
            cy.contains('summary', 'View test instructions').click()
            cy.contains('Approval is blocked.').should('be.visible')
        })
    })
})