include node_modules/make-node/main.mk


SOURCES = lib/*.js lib/**/*.js
TESTS = test/*.test.js test/**/*.test.js

LCOVFILE = ./reports/coverage/lcov.info

MOCHAFLAGS = --require ./test/bootstrap/node

SHELL := /bin/bash
.SHELLFLAGS = -ec
.ONESHELL:

install:
	npm i

install-dev:
	npm i

test:
	npx vows --xunit > junit.xml

lint:
	echo "No lint command defined."

integration:
	echo '<testsuite name="integration" tests="0"></testsuite>' > jintegration.xml

view-docs:
	open ./docs/index.html

view-cov:
	open ./reports/coverage/lcov-report/index.html

clean: clean-docs clean-cov
	-rm -r $(REPORTSDIR)

clobber: clean
	-rm -r node_modules


.PHONY: test install install-dev lint integration clean clobber
