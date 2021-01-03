---
description: ''
sidebar: 'sidebar'
next: '/spec/syntax/'
---

# Introduction

**This specification is an ongoing work in progress.**

The Wrought programming language is an imperative expression language designed to directly match the semantics of WebAssembly.
Its syntax is based on the Rust programming language with deviations to simplify lexical analysis and model WASM more closely.
Wrought offers a small subset of what is available in major multi-paradigm languages and is not designed for large scale production usage.


## Initial Features
* Items
  * WASM core components (globals, memory, table, function)
  * Statics (correspond to Data and Element segments)
  * Struct Definitions
* Types
  * WebAssembly value types (e.g. $\term{i32}, \term{f64}$)
  * Pointer types (e.g. $\term{Ptr[u32]}$)
  * Slice types, pointer + length (e.g. $\term{Slice[u32]}$)
  * $\term{bool}$ type, sugar for $\term{i32}$
* Expressions
  * Binary bitwise and arithmetic operators with precedence
  * Short-circuit logical operators for $\term{bool}$


## Deferred Features
* Destructured assignment
* Enumerated types