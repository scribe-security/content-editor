import { BaseComponent, BasePage, Button, getComponent, getComponentByRole, getElement, MUIInput } from '@jahia/cypress'
import IframeOptions = Cypress.IframeOptions
import { ContentEditor } from './contentEditor'

export class PageComposer extends BasePage {
    iFrameOptions: IframeOptions

    constructor() {
        super()
        this.iFrameOptions = { timeout: 90000, log: true }
    }

    static visit(site: string, language: string, path: string): PageComposer {
        cy.visit(`/jahia/page-composer/default/${language}/sites/${site}/${path}`)
        return new PageComposer()
    }

    openCreateContent(): PageComposer {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').contains('Any content').click()
            })
        })
        return this
    }

    createContent(contentType: string): ContentEditor {
        this.openCreateContent()
            .getContentTypeSelector()
            .searchForContentType(contentType)
            .selectContentType(contentType)
            .create()
        return new ContentEditor()
    }

    refresh() {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.get('.window-actions-refresh').click()
        })
        return this
    }

    shouldContain(text: string) {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').should('contain', text)
            })
        })
    }

    componentShouldBeVisible(selector: string) {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.container').find(selector).should('exist').scrollIntoView().should('be.visible')
            })
        })
    }

    editComponent(selector: string) {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.wait(5000)
                cy.get('.container').find(selector).trigger('mouseover').rightclick({ force: true })
            })
        })
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.get('.editModeContextMenu').scrollIntoView().contains('Edit').click()
        })
        return new ContentEditor()
    }

    editComponentByText(text: string): ContentEditor {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.wait(5000)
                cy.get('.container').contains(text).trigger('mouseover').rightclick({ force: true })
            })
        })
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.get('.editModeContextMenu').scrollIntoView().contains('Edit').click()
        })
        return new ContentEditor()
    }

    getContentTypeSelector(): ContentTypeSelector {
        return getComponent(ContentTypeSelector)
    }

    shouldContainWIPOverlay() {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.iframe('.gwt-Frame', this.iFrameOptions).within(() => {
                cy.get('.workinprogress-overlay').should('contain', 'Work in progress')
            })
        })
    }

    editPage(title: string): ContentEditor {
        cy.iframe('#page-composer-frame', this.iFrameOptions).within(() => {
            cy.get('#JahiaGxtPagesTab').contains(title).rightclick({ force: true })
            cy.get('.pagesContextMenuAnthracite').contains('Edit').click({ force: true })
        })
        return new ContentEditor()
    }
}

export class ContentTypeSelector extends BaseComponent {
    static defaultSelector = 'div[aria-labelledby="dialog-createNewContent"]'

    searchInput = getComponentByRole(MUIInput, 'content-type-dialog-input', this)

    searchForContentType(contentType: string): ContentTypeSelector {
        this.searchInput.type(contentType)
        return this
    }

    selectContentType(contentType: string): ContentTypeSelector {
        getElement('[data-sel-role="content-type-tree"] span', this).contains(contentType).click()
        return this
    }

    cancel(): void {
        getComponentByRole(Button, 'content-type-dialog-cancel', this).click()
    }

    create(): ContentEditor {
        getComponentByRole(Button, 'content-type-dialog-create', this).click()
        return new ContentEditor()
    }
}
