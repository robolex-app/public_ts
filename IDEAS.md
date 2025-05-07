The output should be both JSON Schema and JSON Type definitions.

The main current issue is how not to overwhelm the meta with very custom types and options.

The current idea of adding

```ts
{
  type: 'number',
}
```

seems good-enough, but we also use `{type: 'optional'}` and `{type: 'array'}`.

When it comes to basic types I think we should use the JDT (which are also used in the JSON Schema) but without mix/max stuff or formatting stuff.

    string
    number
    integer
    object
    array
    boolean
    null
