---
description: 'The definition of the lexical structure of Wrought source code'
sidebar: 'spec'
next: '/spec/semantics/'
---

# Syntax

## Tokens
The following paragraphs define, in precedence order, the kinds of tokens defined in Wrought.
Wrought source code is split into tokens by repeatedly consuming the longest string of characters that matches a token rule,
and tie-breaking by precedence order.

### Comments
Wrought allows only single-line double-slash prefixed comments.
```
//[^\n]*
```

### 

## Grammar
