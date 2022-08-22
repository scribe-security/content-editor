import { contentTypes } from '../../fixtures/pickers/contentTypes'
import { PageComposer } from '../../page-object/pageComposer'
import { assertUtils } from '../../utils/assertUtils'

describe('Folder picker tests', () => {
    const siteKey = 'digitall'
    let pageComposer: PageComposer

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login() // edit in chief
        cy.apollo({ mutationFile: 'pickers/createContent.graphql' })

        // beforeEach()
        pageComposer = PageComposer.visit(siteKey, 'en', 'home.html')
    })

    afterEach(() => {
        cy.apollo({ mutationFile: 'pickers/deleteContent.graphql' })
        cy.logout()
    })

    // tests

    it('should display a folder picker without tree', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['folderpicker'].typeName)
            .getPickerField(contentTypes['folderpicker'].fieldNodeType, contentTypes['folderpicker'].multiple)
        const picker = pickerField.open()

        // assert components are visible
        assertUtils.isVisible(picker.get())
        assertUtils.isVisible(picker.getSiteSwitcher())
        picker.assertHasNoTree()
    })

    it('should display root folder opened', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['folderpicker'].typeName)
            .getPickerField(contentTypes['folderpicker'].fieldNodeType, contentTypes['folderpicker'].multiple)
        const picker = pickerField.open()

        picker.getTable().getRowByIndex(1).get().find('span').first().should('contain', 'files')

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files')
    })

    it('should be able to open and close folder', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['folderpicker'].typeName)
            .getPickerField(contentTypes['folderpicker'].fieldNodeType, contentTypes['folderpicker'].multiple)
        const picker = pickerField.open()

        picker.getTable().getRowByIndex(1).get().find('svg').first().click()

        picker.getTable().getRows((el) => expect(el).to.have.length(1))

        picker.getTable().getRowByIndex(1).get().find('svg').first().click()

        picker.getTable().getRows((el) => expect(el).to.have.length.of.at.least(2))
    })

    it('should be able to select a folder', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['folderpicker'].typeName)
            .getPickerField(contentTypes['folderpicker'].fieldNodeType, contentTypes['folderpicker'].multiple)
        let picker = pickerField.open()

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files').click()

        picker.select()
        pickerField.assertValue('ce-picker-files')
        picker = pickerField.open()
        picker.getTableRow('ce-picker-files').should('have.class', 'moonstone-TableRow-highlighted')
    })

    it('should be able to switch site', () => {
        const pickerField = pageComposer
            .createContent(contentTypes['folderpicker'].typeName)
            .getPickerField(contentTypes['folderpicker'].fieldNodeType, contentTypes['folderpicker'].multiple)
        const picker = pickerField.open()

        picker.getTable().getRowByIndex(2).get().find('span').first().should('contain', 'ce-picker-files').click()
        picker.getSiteSwitcher().should('contain', 'Digitall')
        picker.getSiteSwitcher().select('System Site')
        picker.getSiteSwitcher().should('contain', 'System Site')
        picker.getTable().getRows((el) => expect(el).to.have.length(1))
        picker.getSiteSwitcher().select('Digitall')
        picker.getTableRow('ce-picker-files').should('have.class', 'moonstone-TableRow-highlighted')
    })
})
