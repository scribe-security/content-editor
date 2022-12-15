BOLD := $(shell tput -T linux bold)
PURPLE := $(shell tput -T linux setaf 5)
GREEN := $(shell tput -T linux setaf 2)
CYAN := $(shell tput -T linux setaf 6)
RED := $(shell tput -T linux setaf 1)
RESET := $(shell tput -T linux sgr0)
TITLE := $(BOLD)$(PURPLE)
SUCCESS := $(BOLD)$(GREEN)

define title
    @printf '$(TITLE)$(1)$(RESET)\n'
endef

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(BOLD)$(CYAN)%-25s$(RESET)%s\n", $$1, $$2}'


.PHONY: build
build: ## Build package
	mvn -B -U -ntp -s .github/maven.settings.xml clean install

.PHONY: copy-dep
copy-deb: ## Copy dependencies to provision artifacts
	mvn -B -s .github/maven.settings.xml dependency:copy-dependencies -DexcludeTransitive=true -DincludeScope=provided -DincludeGroupIds=org.jahia.modules -DincludeTypes=jar

.PHONY: prepare
prepare: ## Prepare artifacts
	@bash prepare.sh