NSCMS
=====

## Run

`node index.js`

Server runs in port 3001.

Home: `http://localhost:3001/<template.key>`

## Template 

Form to create template: http://localhost:3001/template.html

At home there are two test variables that are interpolated: title and body.
To use in template or partial:

`{{=it.title}}` and `{{=it.body}}`

## Partial

Form to create partial: http://localhost:3001/partial.html

## Using partial in template

`{{#def.\<partial.key\>}}`

