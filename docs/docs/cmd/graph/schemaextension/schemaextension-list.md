# graph schemaextension list

Get a list of schemaExtension objects created in the current tenant, that can be InDevelopment, Available, or Deprecated.

## Usage

```sh
m365 graph schemaextension list [options]
```

## Options

`-s, --status [status]`
: The status to filter on. Available values are Available, InDevelopment, Deprecated

`--owner [owner]`
: The id of the owner to filter on

`-p, --pageSize [pageSize]`
: Number of objects to return

`-n, --pageNumber [pageNumber]`
: Page number to return if pageSize is specified (first page is indexed as value of 0)

--8<-- "docs/cmd/_global.md"

## Remarks

pageNumber is specified as a 0-based index. A value of 2 returns the third page of items. 

## Examples

Get a list of schemaExtension objects created in the current tenant, that can be InDevelopment, Available, or Deprecated.

```sh
m365 graph schemaextension list 
```

Get a list of schemaExtension objects created in the current tenant, with owner 617720dc-85fc-45d7-a187-cee75eaf239e

```sh
m365 graph schemaextension list --owner 617720dc-85fc-45d7-a187-cee75eaf239e
```

Get a list of schemaExtension objects created in the current tenant, with owner 617720dc-85fc-45d7-a187-cee75eaf239e and return the third page of results of 10

```sh
m365 graph schemaextension list --owner 617720dc-85fc-45d7-a187-cee75eaf239e --pageNumber 2 --pageSize 10
```

## More information

[https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/schemaextension_list](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/schemaextension_list)

## Response

=== "JSON"

```json
[
  {
    "id": "adatumisv_exo2",
    "description": "sample desccription",
    "targetTypes": [
      "Message"
    ],
    "status": "Available",
    "owner": "617720dc-85fc-45d7-a187-cee75eaf239e",
    "properties": [
      {
        "name": "p1",
        "type": "String"
      },
      {
        "name": "p2",
        "type": "String"
      }
    ]
  }
]
```

=== "Text"

    ``` text
description: sample desccription
id         : adatumisv_exo2
owner      : 617720dc-85fc-45d7-a187-cee75eaf239e
properties : [{"name":"p1","type":"String"},{"name":"p2","type":"String"}]
status     : Available
targetTypes: ["Message"]

````

=== "CSV"

    ``` text
id,description,targetTypes,status,owner,properties
adatumisv_exo2,sample desccription,"[""Message""]",Available,617720dc-85fc-45d7-a187-cee75eaf239e,"[{""name"":""p1"",""type"":""String""},{""name"":""p2"",""type"":""String""}]"

````
