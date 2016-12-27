#!/bin/bash

root=./packages/$(name)
FOO="Bar"
class_name = $(shell echo $(name) | sed 's/.*/\SK&/')

new_pkg:
	echo $(class_name)
	mkdir -p $(root)/dist
	mkdir -p $(root)/src

	touch $(root)/src/index.jsx
	sed -e "s/\pkg_name/$(name)/" -e "s/\class_name/$(class_name)/" ./scripts/index_template.jsx > $(root)/src/index.jsx

	touch $(root)/src/styles.js
	cat ./scripts/styles_template.js > $(root)/src/styles.js

	touch $(root)/package.json
	sed -e "s/\pkg_name/$(name)/" ./scripts/package_template.json > $(root)/package.json

	touch ./packages/demo/stories/$(name).js
	sed -e "s/\pkg_name/$(name)/" ./scripts/story_template.js > ./packages/demo/stories/$(name).js

	echo "\nimport $(name) from './$(name)'" >> ./packages/demo/stories/index.js

	lerna bootstrap