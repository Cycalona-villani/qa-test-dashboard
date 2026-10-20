describe('Test result tracking', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/qa-test-dashboard/', {
            onBeforeLoad(win) {
                win.localStorage.clear()
            },
        })
    })

    it('updates dashboard counts and preserves results after refresh', () => {
        cy.contains('button', /^Test Runs$/).click()

        cy.contains('tr', 'TC-001').find('select').select('Passed')
        cy.contains('tr', 'TC-002').find('select').select('Failed')
        cy.contains('tr', 'TC-003').find('select').select('Blocked')

        cy.contains('button', /^Dashboard$/).click()

        cy.contains('.stat-card', 'Tests Executed')
            .find('h2')
            .should('have.text', '3')

        cy.contains('.stat-card', /^Passed/)
            .find('h2')
            .should('have.text', '1')

        cy.contains('.stat-card', /^Failed/)
            .find('h2')
            .should('have.text', '1')

        cy.reload()
        cy.contains('button', /^Test Runs$/).click()

        cy.contains('tr', 'TC-001')
            .find('select')
            .should('have.value', 'Passed')

        cy.contains('tr', 'TC-002')
            .find('select')
            .should('have.value', 'Failed')

        cy.contains('tr', 'TC-003')
            .find('select')
            .should('have.value', 'Blocked')

        cy.contains('tr', 'TC-002').find('select').select('Not Run')

        cy.contains('button', /^Dashboard$/).click()

        cy.contains('.stat-card', 'Tests Executed')
            .find('h2')
            .should('have.text', '2')

        cy.contains('.stat-card', /^Failed/)
            .find('h2')
            .should('have.text', '0')
    })
})