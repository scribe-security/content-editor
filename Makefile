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
build: ## Build project
	mvn -B -U -ntp -s .github/maven.settings.xml clean install

prepare: ## Prepare project
	mkdir /tmp/artifacts/
	find . -type f -path '*/target/*-SNAPSHOT*.jar' -exec cp '{}' /tmp/artifacts/ ';' || :
	if [ -f target/*source-release.zip ]; then
		echo "A source file is present, copying it to the artifacts folder"
		cp target/*source-release.zip /tmp/artifacts/ || :
	fi
	if [ -d ${{ inputs.module_id }}/ ]; then
		echo "Copying jar from: ${{ inputs.module_id }}/"
		cp ${{ inputs.module_id }}/target/*.jar /tmp/artifacts/ || :
		if [ ! -d target/ ]; then
		mkdir target/
		fi
		cp ${{ inputs.module_id }}/target/*.jar target/ || :
	fi
