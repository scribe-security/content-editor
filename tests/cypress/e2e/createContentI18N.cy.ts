import {PageComposer} from '../page-object/pageComposer';

const sitekey = 'contentEditorSiteI18N';
describe('Create content tests in I18N site', () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('createSiteI18N.groovy', {SITEKEY: sitekey});
        cy.login(); // Edit in chief
        pageComposer = PageComposer.visit(sitekey, 'en', 'home.html');
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: sitekey});
    });

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID');
    });

    it('Can create content', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Test');
    });

    it('Can create multiple content in same modal', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        let contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-test-multiple-1');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').type('Cypress Multiple Content Test 1');
        contentEditor.addAnotherContent();
        contentEditor.save();
        contentEditor.closeSection('Content');
        contentEditor
            .openSection('Options')
            .get()
            .find('input[type="text"]')
            .should('have.value', 'rich-text')
            .clear()
            .type('cypress-test-multiple-2');
        contentSection = contentEditor.openSection('Content');
        // CKEditor will stay in source mode so no need to click on source again
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Multiple Content Test 2');
        contentEditor.removeAnotherContent();
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Multiple Content Test 1');
        pageComposer.shouldContain('Cypress Multiple Content Test 2');
    });

    it('Can create work in progress content for all properties', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode('ALL');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-all-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress ALL Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Work In Progress ALL Test');
        pageComposer.shouldContainWIPOverlay();
    });

    it('Can create work in progress content for en/fr properties', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Rich Text')
            .selectContentType('Rich text')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create Rich text');
        // Activate Work in progress
        contentEditor.activateWorkInProgressMode('en,fr');
        const contentSection = contentEditor.openSection('Content');
        contentEditor.openSection('Options').get().find('input[type="text"]').clear().type('cypress-wip-en_fr-test');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').type('Cypress Work In Progress EN/FR Test');
        // Switch to French
        contentEditor.getLanguageSwitcher().select('Français');
        cy.get('[data-sel-role="wip-info-chip"]', {timeout: 1000}).should('contain', 'WIP - FR');
        cy.focused().frameLoaded('iframe.cke_wysiwyg_frame');
        contentSection.expand().get().find('.cke_button__source').click();
        contentSection.get().find('textarea').should('have.value', '').type('Cypress Work In Progress FR/EN Test');
        contentEditor.save();
        pageComposer.refresh().shouldContain('Cypress Work In Progress EN/FR Test');
        pageComposer.shouldContainWIPOverlay();
        PageComposer.visit(sitekey, 'fr', 'home.html');
        pageComposer.refresh().shouldContain('Cypress Work In Progress FR/EN Test');
        pageComposer.shouldContainWIPOverlay();
    });
});
