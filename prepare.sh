#!/bin/bash

mkdir /tmp/artifacts/
find . -type f -path '*/target/*-SNAPSHOT*.jar' -exec cp '{}' /tmp/artifacts/ ';' || :
if [ -f target/*source-release.zip ]; then
	echo "A source file is present, copying it to the artifacts folder"
	cp target/*source-release.zip /tmp/artifacts/ || :
fi
if [ -d content-editor/ ]; then
	echo "Copying jar from: content-editor/"
	cp content-editor/target/*.jar /tmp/artifacts/ || :
	if [ ! -d target/ ]; then
	mkdir target/
	fi
	cp content-editor/target/*.jar target/ || :
fi
