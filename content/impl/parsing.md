---
description: 'Information about parsing Wrought'
sidebar: 'sidebar'
---

# Parsing

## Wrought Properties

 * Wrought is defined by a Context-Free Grammar
 * The Wrought grammar has left-recursion to represent left-associative expressions
 * The Wrought grammar encodes precedence in the standard way, and does not introduce ambiguity
 * All parenthesis, braces, and brackets in the Wrought grammar are matched and well-nested
 * The $\terms{<}$ and $\terms{>}$ symbols are not ever used to represent start and stop
 * The raw string literal token cannot be parsed by a regular expression, because it uses an arbitrary matching number of $\terms{\verb@#@}$ symbols in marking the beginning and end

## Parser Criteria

### Goals
 * Generate a parse-tree which omits whitespace and comments
 * Preserve code span information in the parse tree
 * Derive the parser from a representation of the language grammar for verification purposes

### Requirements
 * Be compatible with a separate lexer or allow custom lexing rules
 * Support left-recursion

### Constraints
 * Be rust-compatible

## Library Options

### Tree Sitter (GLR)

https://tree-sitter.github.io/tree-sitter/

### GRM Tools (LR)

https://softdevteam.github.io/grmtools/master/book/quickstart.html

### Rowan

https://github.com/rust-analyzer/rowan

## References

1. [Which Parsing Approach?](https://tratt.net/laurie/blog/entries/which_parsing_approach.html)